import {guid} from '../Common/guid';
import ODataDate from '../Common/Date/ODataDate';
import common from '../Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../Operations/MobileStatus/OperationMobileStatusLibrary';
import supervisor from '../Supervisor/SupervisorLibrary';
import noteWrapper from '../Supervisor/MobileStatus/NoteWrapper';
import {ChecklistLibrary} from '../Checklists/ChecklistLibrary';
import toolbarCaption from '../Operations/MobileStatus/OperationMobileStatusToolBarCaption';
import phaseModelEnabled from '../Common/IsPhaseModelEnabled';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import CompleteOperationMobileStatusAction from '../Operations/MobileStatus/CompleteOperationMobileStatusAction';

function rollbackMobileStatus(context, mobileStatusEditLink, showBanner) {
    let actionObject = {
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'PMMobileStatuses',
                'EditLink': mobileStatusEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    };

    if (showBanner) {
        actionObject.OnSuccess = {
            'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action',
            'Properties': {
                'Message': '$(L,assign_failure)',
            },
        };
    }
    return context.executeAction(actionObject).then(result => {
        try {
            return JSON.parse(result.data);
        } catch (exc) {
            return {};
        }
    });
}

function rollbackAssignment(context, assignmentEditLink) {
    return context.executeAction({
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WorkOrderTransfers',
                'EditLink': assignmentEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    }).then(result => {
        try {
            return JSON.parse(result.data);
        } catch (exc) {
            return {};
        }
    });
}

function assignToSelf(context, binding, updateResult) {
    if (binding.PersonNum === '00000000') {
        let employee = common.getPersonnelNumber();
        return context.executeAction({
            'Name' : '/SAPAssetManager/Actions/MobileStatus/OperationSelfAssign.action',
            'Properties': {
                'Properties': {
                    'OperationNo': binding.OperationNo,
                    'OrderId': binding.OrderId,
                    'EmployeeTo': employee,
                },
            },
        }).then((selfAssign) => {
            selfAssign = JSON.parse(selfAssign.data);
            // Only attempt to upload Operation Transfer if device is online
            if (context.getPageProxy().nativescript.connectivityModule.getConnectionType() > 0) {
                // Upload the created WorkOrderTransfer record
                return context.executeAction('/SAPAssetManager/Actions/MobileStatus/OperationTransferUpload.action').then(() => {
                    // Check Error Archive to see if issues occurred during assignment
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], "$filter=RequestMethod eq 'POST' and RequestURL eq '/WorkOrderTransfers'").then(entries => {
                        if (entries.length === 0) {
                            // If no errors, re-download Operation and proceed to update toolbar
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/MobileStatus/OperationTransferDownload.action',
                                'Properties': {
                                    'DefiningRequests' : [{
                                        'Name': 'MyWorkOrderOperations',
                                        'Query': `$filter=OrderId eq '${binding.OrderId}' and OperationNo eq '${binding.OperationNo}'`,
                                    }],
                                },
                            }).then(() => {
                                // Update PersonNum so subsequent transitions don't trigger an upload
                                binding.PersonNum = employee;
                            });
                        } else {
                            // If errors occurred trying to assign operation, roll back Overall Status and delete all related ErrorArchive entries (normally should only be one)
                            let actionPromises = [];
                            entries.forEach(entry => {
                                actionPromises.push(context.executeAction({
                                    'Name' : '/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action',
                                    'Properties': {
                                        'OnSuccess': '',
                                        'OnFailure': '',
                                        'Target': {
                                            'EntitySet': 'ErrorArchive',
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                            'QueryOptions': `$filter=RequestID eq ${entry.RequestID}`,
                                        },
                                    },
                                }));
                            });
                            return Promise.all(actionPromises).then(() => {
                                return rollbackMobileStatus(context, updateResult['@odata.editLink'], true).then(result => {
                                    // Hack -- See MobileStatusPopover.js
                                    binding.OperationMobileStatus_Nav.MobileStatus = result.MobileStatus;
                                });
                            });
                        }
                    });
                }, () => {
                    // If upload fails due to a network issue, roll back Overall Status and Transfer
                    let promises = [];
                    promises.push(rollbackMobileStatus(context, updateResult['@odata.editLink']), true);
                    promises.push(rollbackAssignment(context, selfAssign['@odata.editLink']), true);

                    return Promise.all(promises).then(rollbackResults => {
                        // Hack -- See MobileStatusPopover.js
                        binding.OperationMobileStatus_Nav.MobileStatus = rollbackResults[0].MobileStatus;
                    });
                });
            } else {
                // "Transfer" operation so client doesn't think it's unassigned
                return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationUpdateAssignment.action',
                    'Properties': {
                        'Properties': {
                            'PersonNum' : employee,
                        },
                        'Headers': {
                            'Transaction.Ignore': 'true',
                        },
                    },
                });
            }
        });
    } else {
        return Promise.resolve();
    }
}

/**
* Mobile Status post-update rule
* @param {IClientAPI} context
*/
export default function OperationMobileStatusPostUpdate(context) {
    const cicoEnabled = libClock.isCICOEnabled(context);
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const userGUID = common.getUserGuid(context);
    const userId = common.getSapUserName(context);

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
            return context.binding.OperationMobileStatus_Nav;
        }
    })();

    let UpdateCICO = function() {
        let requiresCICO = true;
        // Save timestamp for confirmation/CATS
        let odataDate = new ODataDate();
        common.setStateVariable(context, 'StatusStartDate', odataDate.date());

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
                    'OperationNo': context.binding.OperationNo,
                    'SubOperationNo': '',
                    'OrderId': context.binding.OrderId,
                    'PreferenceGroup': cicoValue,
                    'PreferenceName': context.binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': userId,
                },
                'CreateLinks': [{
                    'Property': 'WOOperation_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderOperations',
                        'ReadLink': `MyWorkOrderOperations(OrderId='${context.binding.OrderId}',OperationNo='${context.binding.OperationNo}')`,
                    },
                }],
            }}).then(() => {
                if (updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') {
                    return OperationMobileStatusLibrary.showTimeCaptureMessage(context);
                } else {
                    return Promise.resolve();
                }
            });
        } else {
            if (updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') {
                return OperationMobileStatusLibrary.showTimeCaptureMessage(context);
            } else {
                return Promise.resolve();
            }
        }
    };

    if (updateResult.MobileStatus === COMPLETE || updateResult.MobileStatus === REVIEW) {
        return ChecklistLibrary.allowWorkOrderComplete(context, context.binding.HeaderEquipment, context.binding.HeaderFunctionLocation).then(results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                return OperationMobileStatusLibrary.completeOperation(context, updateResult, () => { // May throw rejected Promise if signature required and declined
                    return libMobile.NotificationUpdateMalfunctionEnd(context, context.binding);
                }).catch(() => {
                    // Roll back mobile status update
                    return Promise.reject();
                });
            } else {
                return Promise.resolve();
            }
        }).then(() => {
            return supervisor.checkReviewRequired(context, context.binding).then(reviewRequired => {
                context.binding.SupervisorDisallowFinal = '';
                if (reviewRequired) {
                    context.binding.SupervisorDisallowFinal = true; //Tech cannot set final confirmation on review
                }
                return noteWrapper(context, reviewRequired).then(() => { //Allow tech to leave note for supervisor
                    context.getClientData().ChangeStatus = updateResult.MobileStatus;
                    return OperationMobileStatusLibrary.showTimeCaptureMessage(context, !reviewRequired, updateResult.MobileStatus);
                });
            });
        }).then(() => {
            libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
            return UpdateCICO().then(() => {
                let actionArgs = {
                    OperationId: context.binding.OperationNo,
                    WorkOrderId: context.binding.OrderId,
                    isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
                    isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
                    didCreateFinalConfirmation: common.getStateVariable(context, 'IsFinalConfirmation', common.getPageName(context)),
                };
                let action = new CompleteOperationMobileStatusAction(actionArgs);
                context.getClientData().confirmationArgs = {
                    doCheckOperationComplete: false,
                };
                context.getClientData().mobileStatusAction = action;
                return action.execute(context).then((result) => {
                    if (result) {
                        return libClock.reloadUserTimeEntries(context).then(() => {
                            return toolbarCaption(context).then(caption => {
                                if (updateResult.MobileStatus === COMPLETE) {
                                    common.enableToolBar(context, 'WorkOrderOperationDetailsPage', 'IssuePartTbI', false);
                                }
                                return UpdateToolbarCaption(context, caption);
                            });
                        });
                    }

                    return Promise.reject();
                });
            });
        }).catch(() => {
            // Roll back mobile status update
            return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
        });
    } else {
        let selfAssignPromise = Promise.resolve();

        if (phaseModelEnabled()) {
            selfAssignPromise = assignToSelf(context, context.binding, updateResult);
        }

        return selfAssignPromise.then(() => {
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
