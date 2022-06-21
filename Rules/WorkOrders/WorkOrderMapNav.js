import GetGeometryInformation from '../Common/GetGeometryInformation';

export default function WorkOrderMapNav(context) {

    let geometry = context.getBindingObject().geometry;

    if (geometry && Object.keys(geometry).length > 0) {
        // If this is a valid Work Order, navigate immediately
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action');
    } else {

        return GetGeometryInformation(context.getPageProxy(), 'WOGeometries').then(function(value) {
            if (value !== undefined) {
                context.getPageProxy().setActionBinding(value);
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action');
            }
            return null;
        });
    }
}
