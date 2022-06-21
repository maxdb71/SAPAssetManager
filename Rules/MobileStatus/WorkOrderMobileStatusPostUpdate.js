import {guid} from '../Common/guid';
import ODataDate from '../Common/Date/ODataDate';
import libCom from '../Common/Library/CommonLibrary';
import WorkOrderMobileStatusLibrary from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import supervisor from '../Supervisor/SupervisorLibrary';
import noteWrapper from '../Supervisor/MobileStatus/NoteWrapper';
import {ChecklistLibrary} from '../Checklists/ChecklistLibrary';
import toolbarCaption from '../WorkOrders/MobileStatus/WorkOrderMobileStatusToolBarCaption';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';

function NotificationUpdateMalfunctionEnd(context, woBinding) {
    if (woBinding.NotificationNumber) {
        let binding = context.getBindingObject();

        let readLink = woBinding['@odata.readLink'] + '/Notification';
        return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=NotifMobileStatus_Nav').then(results => {
            if (results && results.length > 0) {
                let notif = results.getItem(0);
                let complete = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                if (notif.BreakdownIndicator && notif.NotifMobileStatus_Nav.MobileStatus !== complete && !notif.MalfunctionEndDate) {  //Breakdown is set and end date is not set and notification is not already complete
                    let oldBinding = binding;
                    context.getPageProxy().setActionBinding(notif);
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationUpdateMalfunctionEndNav.action').then(() => {
                        context.getPageProxy().setActionBinding(oldBinding);
                        return Promise.resolve();
                    });
                }
            }
            return Promise.resolve();
        });
    }
    return Promise.resolve();
}

/**
* Mobile Status post-update rule
* @param {IClientAPI} context
*/
export default function WorkOrderMobileStatusPostUpdate(context) {
    const cicoEnabled = libClock.isCICOEnabled(context);
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const userGUID = libCom.getUserGuid(context);
    const userId = libCom.getSapUserName(context);

    const updateResult = (() => {
        try {
            let data = JSON.parse(context.getActionResult('MobileStatusUpdate').data);
            if (data.MobileStatus === 'D-COMPLETE') {
                data.MobileStatus = COMPLETE;
            }
            if (data.MobileStatus === 'D-REVIEW') {
                data.MobileStatus = REVIEW;
            }
            return data;
        } catch (exc) {
            // If no action result, assume no mobile status change (CICO) -- return existing PM Mobile Status
            return context.binding.OrderMobileStatus_Nav;
        }
    })();

    let UpdateCICO = function() {
        let requiresCICO = true;
        // Save timestamp for confirmation/CATS
        let odataDate = new ODataDate();
        libCom.setStateVariable(context, 'StatusStartDate', odataDate.date());

        // Create relevant CICO entry
        let cicoValue = '';
        switch (updateResult.MobileStatus) {
            case STARTED:
                cicoValue = cicoEnabled ? 'CLOCK_IN' : 'START_TIME';
                break;
            case HOLD:
            case COMPLETE:
            case REVIEW:
                cicoValue = cicoEnabled ? 'CLOCK_OUT' : 'END_TIME';
                break;
            default:
                break;
        }
        if (updateResult.MobileStatus === COMPLETE) {
            requiresCICO = libClock.isBusinessObjectClockedIn(context);  //Only clock out if this object is clocked in.  Handles supervisor approving a technician's work case
        }
        if (cicoValue && requiresCICO) { //Only add to CICO if status requires
            return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': guid(),
                    'UserGUID': userGUID,
                    'OperationNo': '',
                    'SubOperationNo': '',
                    'OrderId': context.binding.OrderId,
                    'PreferenceGroup': cicoValue,
                    'PreferenceName': context.binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': userId,
                },
                'CreateLinks': [{
                    'Property': 'WOHeader_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderHeaders',
                        'ReadLink': `MyWorkOrderHeaders('${context.binding.OrderId}')`,
                    },
                }],
            }}).then(() => {
                if (updateResult.MobileStatus === HOLD) {
                    return WorkOrderMobileStatusLibrary.showTimeCaptureMessage(context);
                } else {
                    return Promise.resolve();
                }
            });
        } else {
            if (updateResult.MobileStatus === HOLD) {
                return WorkOrderMobileStatusLibrary.showTimeCaptureMessage(context);
            } else {
                return Promise.resolve();
            }
        }
    };

    if (updateResult.MobileStatus === COMPLETE || updateResult.MobileStatus === REVIEW) {
        return ChecklistLibrary.allowWorkOrderComplete(context, context.binding.HeaderEquipment, context.binding.HeaderFunctionLocation).then(results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                return WorkOrderMobileStatusLibrary.completeWorkOrder(context, updateResult, () => {
                    return NotificationUpdateMalfunctionEnd(context, context.binding);
                });
            } else {
                return Promise.reject();
            }
        }).then(() => {
            return supervisor.checkReviewRequired(context, context.binding).then(review => {
                context.binding.SupervisorDisallowFinal = '';
                if (review) {
                    context.binding.SupervisorDisallowFinal = true; //Tech cannot set final confirmation on review
                }
                ///pass in a flag to avoid executing workorder complete twice during confimation flow 
                let checkWorkOrderComplete = true;
                if (updateResult.MobileStatus === COMPLETE) {
                    checkWorkOrderComplete = false;
                }
                return noteWrapper(context, review).then(() => { //Allow tech to leave note for supervisor
                    ///passing in workorder complete flag
                    return WorkOrderMobileStatusLibrary.showTimeCaptureMessage(context, !review, updateResult.MobileStatus,checkWorkOrderComplete);
                });
            });
        }).then(() => {
            libCom.setStateVariable(context, 'MobileStatusSaveRequired', updateResult.MobileStatus);
            return MobileStatusUpdateOverride(context).then(() => {
                libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
                return UpdateCICO().then(() => {
                    return libClock.reloadUserTimeEntries(context).then(() => {
                        return toolbarCaption(context).then(caption => {
                            if (updateResult.MobileStatus === COMPLETE) {
                                libCom.enableToolBar(context, 'WorkOrderDetailsPage', 'IssuePartTbI', false);
                            }
                            return UpdateToolbarCaption(context, caption);
                        });
                    });
                });
            });
        }).catch(() => {
            // Roll back mobile status update
            return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
        });
    } else {
        return MobileStatusUpdateOverride(context).then(() => {
            libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
            return UpdateCICO().then(() => {
                return libClock.reloadUserTimeEntries(context).then(() => {
                    return toolbarCaption(context).then(caption => {
                        return UpdateToolbarCaption(context, caption);
                    });
                });
            });
        });
    }
}

/**
 * Update the screen's toolbar with the new status
 * @param {*} caption 
 * @returns 
 */
 function UpdateToolbarCaption(context, caption) {

    let pageContext = context;
    if (typeof context.setToolbarItemCaption !== 'function') {
        pageContext = context.getPageProxy();
    }
    pageContext.setToolbarItemCaption('IssuePartTbI', caption);
    return Promise.resolve();

}

/**
 * Update the mobile status if necessary
 * @param {*} context 
 * @param {*} status 
 * @returns 
 */
 function MobileStatusUpdateOverride(context) {

    if (libCom.getStateVariable(context, 'MobileStatusSaveRequired')) { //Complete or Review status needs to be set now
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
            'Properties':
            {
                'Properties':
                {
                    'MobileStatus': libCom.getStateVariable(context, 'MobileStatusSaveRequired'),
                },
                'Target':
                {
                    'EntitySet': 'PMMobileStatuses',
                    'ReadLink' : libCom.getStateVariable(context, 'MobileStatusReadLinkSaveRequired'),
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
                'Headers': {
                    'OfflineOData.NonMergeable': true,
                },
                'ShowActivityIndicator': true,
                'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action',
            },
        });
    }
    return Promise.resolve();
}

