
import libCom from '../Common/Library/CommonLibrary';
export default function DataSubscriptions(context) {
    let pageName = libCom.getPageName(context);
    switch (pageName) {
        case 'NotificationsListViewPage':
            return [
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'UserPreferences',
                'MyEquipments',
                'PMMobileStatuses',
                'CatsTimesheetOverviewRows',
                'ConfirmationOverviewRows',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'OverviewPage':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'SideMenuDrawer':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'WorkOrdersListViewPage':
            return [
                'PMMobileStatuses', 
                'MyWorkOrderHeaderLongTexts',
                'UserTimeEntries',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        default:
            break;
        }
}
