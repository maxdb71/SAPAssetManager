export default function FunctionalLocationMapNav(context) {
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            context.getPageProxy().setActionBinding(context.getPageProxy().getClientData().geometry);
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
        }
    } else {
        let binding = context.getBindingObject();
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=FuncLocGeometries/Geometry').then(function(flocResult) {
            let item = flocResult.getItem(0);
            if (item && item.FuncLocGeometries && item.FuncLocGeometries.length > 0 && item.FuncLocGeometries[0].Geometry) {
                context.getPageProxy().setActionBinding(flocResult.getItem(0));
                return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
            } else {
                return null;
            }
        });
    }
}
