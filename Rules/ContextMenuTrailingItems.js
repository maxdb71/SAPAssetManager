import common from './Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from './Supervisor/isSupervisorFeatureEnabled';

export default function ContextMenuTrailingItems(context) {
    let trailing = [];

    let entityType = context.binding['@odata.type'];
    let isLocal = common.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            if (isSupervisorFeatureEnabled(context)) {//As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return trailing;
            }
            if (isLocal)
                trailing = ['Edit_WorkOrder','Delete_WorkOrder'];
            else
                trailing = ['Edit_WorkOrder'];
            break;
        case '#sap_mobile.MyWorkOrderOperation':
            if (isSupervisorFeatureEnabled(context)) {//As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return trailing;
            }
            if (isLocal) {
                trailing = ['Edit_Operation','Delete_Operation'];
            } else {
                trailing = ['Edit_Operation'];
            }
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            if (isLocal) {
                trailing = ['Edit_SubOperation','Delete_SubOperation'];
            } else {
                trailing = ['Edit_SubOperation'];
            }
            break;
        case '#sap_mobile.MyNotificationHeader':
            if (isLocal) {
                trailing = ['Edit_Notification','Delete_Notification'];
            } else {
                trailing = ['Edit_Notification'];
            }
            break;
        case '#sap_mobile.MyFunctionalLocation':
            if (context.binding.MeasuringPoints.length > 0)
                trailing = ['Take_Reading'];
            else
                trailing = [];
            break;
        case '#sap_mobile.MyEquipment':
            if (context.binding.MeasuringPoints.length > 0)
                trailing = ['Take_Reading'];
            else
                trailing = [];
            break;
        case '#sap_mobile.CatsTimesheetOverviewRow':
                trailing = ['Delete_Timesheet'];
            break;
        case '#sap_mobile.Confirmation':
            if (isLocal) {
                trailing = ['Delete_Confirmation'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MyFuncLocDocument':
        case '#sap_mobile.MyNotifDocument':
        case '#sap_mobile.MyEquipDocument':
        case '#sap_mobile.MyWorkOrderDocument':
        case '#sap_mobile.Document':
            if (isLocal) {
                trailing = ['Delete_Document'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MeasurementDocument':
            if (isLocal) {
                trailing = ['Delete_MeasurementDocument'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.UserPreference':
            trailing = ['Delete_Entry'];
            break;
        case '#OfflineOData.ErrorArchiveEntity':
            trailing = ['Delete_Entry'];
            break;
        default:
            break;
    }
    return trailing;
}
