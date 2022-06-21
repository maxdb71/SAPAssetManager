import libComm from './Common/Library/CommonLibrary';
import WorkOrderEnableMobileStatus from './WorkOrders/MobileStatus/WorkOrderEnableMobileStatus';
import libWOMobile from './WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import NotificationEnableMobileStatus from './Notifications/MobileStatus/NotificationEnableMobileStatus';
import MobileStatusLibrary from './MobileStatus/MobileStatusLibrary';
import IsPhaseModelEnabled from './Common/IsPhaseModelEnabled';
import libSup from './Supervisor/SupervisorLibrary';
import libOPMobile from './Operations/MobileStatus/OperationMobileStatusLibrary';
import isSupervisorFeatureEnabled from './Supervisor/isSupervisorFeatureEnabled';

export default function ContextMenuLeadingItems(context) {

    // Declare mobile statuses as rule-scoped constants
    const RECEIVED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const STARTED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const SUCCESS = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());

    // Helper function: determine items to show for Notification context menu
    let notificationStartComplete = function() {
        return NotificationEnableMobileStatus(context).then(enabled => {
            let leadingItems = [];
            if (enabled) {
                leadingItems.push('Add_Item');
                if (MobileStatusLibrary.getMobileStatus(context.binding, context) === STARTED)  {
                    if (IsPhaseModelEnabled(context)) {
                        leadingItems.unshift('End_Notification');
                    } else {
                        // Get number of Items with unfinished Item Tasks. If zero, return true
                        let allItemTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Items`, `$filter=ItemTasks/any(itmTask : itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${COMPLETED}' and itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${SUCCESS}')`).then(count => {
                            return count === 0;
                        });
                        // Get number of unfinished Tasks. If zero, return true
                        let allTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Tasks`, `$filter=TaskMobileStatus_Nav/MobileStatus ne '${COMPLETED}' and TaskMobileStatus_Nav/MobileStatus ne '${SUCCESS}'`).then(count => {
                            return count === 0;
                        });

                        return Promise.all([allItemTasksComplete, allTasksComplete]).then(results => {
                            if (results[0] && results[1]) {
                                leadingItems.unshift('End_Notification');
                            }
                            return leadingItems;
                        });
                    }
                } else if (MobileStatusLibrary.getMobileStatus(context.binding, context) === RECEIVED) {
                    leadingItems.unshift('Start_Notification');
                }
            }
            return leadingItems;
        });
    };

    // Helper function: determine items to show for Work Order context menu
    let orderStartComplete = function() {
        let enableMobileStatusChange = WorkOrderEnableMobileStatus(context);
        let enableMobileStatusStart = libWOMobile.isAnyWorkOrderStarted(context);

        return Promise.all([enableMobileStatusChange, enableMobileStatusStart]).then(params => {
            const enableStatusChange = params[0];
            const enableStart = !params[1];
            if (enableStatusChange) {
                if (enableStart && (context.binding.OrderMobileStatus_Nav.MobileStatus === RECEIVED || context.binding.OrderMobileStatus_Nav.MobileStatus === HOLD))
                    return ['Start_WorkOrder', 'Transfer_WorkOrder'];
                else if (context.binding.OrderMobileStatus_Nav.MobileStatus === STARTED) {
                    const statuses = ['Hold_WorkOrder'];
                    return libSup.checkReviewRequired(context, context.binding).then((result) => {
                        if (result)
                            statuses.push('Review_WorkOrder');
                        else
                            statuses.push('Complete_WorkOrder');
                        return statuses;
                    });
                } else
                    return ['Transfer_WorkOrder'];
            } else {
                if (context.binding.OrderMobileStatus_Nav.MobileStatus !== COMPLETED)
                    return ['Add_Notification'];
                else
                    return [];
            }
        });
    };

    // Helper function: determine items to show for Operation context menu
    let operationConfirmUnconfirm = function() {
        if (context.binding.WOHeader.OrderMobileStatus_Nav.MobileStatus === COMPLETED) {
            return Promise.resolve([]);
        } else {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Confirmations`, [], '$orderby=ConfirmationCounter desc&$top=1').then(result => {
                return result.length > 0 && result.getItem(0).FinalConfirmation === 'X';
            }).then(confirmed => {
                if (context.binding.WOHeader.OrderMobileStatus_Nav.MobileStatus === STARTED) {
                    return [confirmed ? 'Unconfirm_Operation' : 'Confirm_Operation', 'Add_Notification'];
                } else if (context.binding.WOHeader.OrderMobileStatus_Nav.MobileStatus !== COMPLETED) {
                    return ['Add_Notification'];
                } else {
                    return [];
                }
            });
        }
    };

    // Helper function: determine items to show for Suboperation context menu
    let suboperationConfirmUnconfirm = function() {
        if (context.binding.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav.MobileStatus === COMPLETED) {
            return Promise.resolve([]);
        } else {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Confirmations`, [], '$orderby=ConfirmationCounter desc&$top=1').then(result => {
                return result.length > 0 && result.getItem(0).FinalConfirmation === 'X';
            }).then(confirmed => {
                if (context.binding.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav.MobileStatus === STARTED) {
                    return [confirmed ? 'Unconfirm_Suboperation' : 'Confirm_Suboperation', 'Add_Notification'];
                } else if (context.binding.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav.MobileStatus !== COMPLETED) {
                    return ['Add_Notification'];
                } else {
                    return [];
                }
            });
        }
    };

    // Rule logic begins here //
    let leading = [];
    let entityType = context.binding['@odata.type'];
    let assignmentType = libComm.getWorkOrderAssnTypeLevel(context);

    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            if (isSupervisorFeatureEnabled(context)) { //As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return leading;
            }
            if (assignmentType === 'Header') {
                leading = orderStartComplete();
            }
            if (assignmentType === 'Operation' || assignmentType === 'SubOperation') {
                return ['Add_Notification'];
            }
            break;
        case '#sap_mobile.MyWorkOrderOperation':
            if (isSupervisorFeatureEnabled(context)) { //As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return leading;
            }
            if (assignmentType === 'Operation') {
                if (context.binding.OperationMobileStatus_Nav.MobileStatus === RECEIVED || context.binding.OperationMobileStatus_Nav.MobileStatus === HOLD) {
                    leading = libOPMobile.isAnyOperationStarted(context).then(isAnyOperationStarted => {
                        let aOptions = isAnyOperationStarted ? ['Transfer_Operation'] : ['Start_Operation', 'Transfer_Operation'];
                        return Promise.resolve(aOptions);
                    });
                } else if (context.binding.OperationMobileStatus_Nav.MobileStatus === STARTED) {
                    leading = Promise.resolve(['Hold_Operation', 'Complete_Operation']);
                } else {
                    leading = Promise.resolve(['Add_Notification']);
                }
            }
            if (assignmentType === 'Header' || assignmentType === 'SubOperation') {
                leading = operationConfirmUnconfirm();
            }
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            if (assignmentType === 'SubOperation') {
                if (context.binding.SubOpMobileStatus_Nav.MobileStatus === RECEIVED || context.binding.SubOpMobileStatus_Nav.MobileStatus === HOLD)
                    leading = Promise.resolve(['Start_Suboperation', 'Transfer_Suboperation']);
                else if (context.binding.SubOpMobileStatus_Nav.MobileStatus === STARTED)
                    leading = Promise.resolve(['Hold_Suboperation', 'Complete_Suboperation']);
                else
                    leading = Promise.resolve(['Add_Notification']);
            } else {
                leading = suboperationConfirmUnconfirm();
            }
            break;
        case '#sap_mobile.MyNotificationHeader':
            leading = notificationStartComplete();
            break;
        case '#sap_mobile.MyFunctionalLocation':
            leading = Promise.resolve(['Add_WorkOrderFromFloc','Add_NotificationFromFloc']);
            break;
        case '#sap_mobile.MyEquipment':
            leading = Promise.resolve(['Add_NotificationFromEquipment', 'Add_WorkOrderFromEquipment']);
            break;
        case '#sap_mobile.CatsTimesheetOverviewRows':
            leading = Promise.resolve(['Delete_Timesheet']);
            break;
        case '#sap_mobile.Confirmations':
            leading = Promise.resolve(['Delete_Confirmation']);
            break;
        case '#sap_mobile.MyFuncLocDocuments':
            break;
        case '#sap_mobile.MyNotifDocuments':
            break;
        case '#sap_mobile.MyEquipDocuments':
            break;
        case '#sap_mobile.MyWorkOrderDocuments':
            break;
        case '#sap_mobile.Documents':
            break;
        case '#sap_mobile.MeasurementDocuments':
            leading = Promise.resolve(['Delete_MeasurementDocument']);
            break;
        default:
            break;
    }
    return leading;
}
