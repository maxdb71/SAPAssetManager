import GetGeometryInformation from '../Common/GetGeometryInformation';

export default function NotificationMapNav(context) {
    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            context.getPageProxy().setActionBinding(context.getPageProxy().getClientData().geometry);
            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapNav.action');
        }
    // Otherwise, determine if we should have geometry data
    } else {
        return GetGeometryInformation(context.getPageProxy(), 'NotifGeometries').then(function(value) {
            if (value && Object.keys(value).length > 0) {
                context.getPageProxy().setActionBinding(value);
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMapNav.action');
            }
            return null;
        });
    }
}
