import GetGeometryInformation from '../Common/GetGeometryInformation';

export default function EquipmentMapNav(context) {
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            context.getPageProxy().setActionBinding(context.getPageProxy().getClientData().geometry);
            return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
        }
    } else {
        return GetGeometryInformation(context.getPageProxy(), 'EquipGeometries').then(function(value) {
            if (Object.keys(value).length > 0) {
                context.getPageProxy().setActionBinding(value);
                return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/FunctionalLocation', [], '').then(function(result) {
                if (result && result.getItem(0)) {
                    context.getPageProxy().setActionBinding(result.getItem(0));
                    return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action');
                } else {
                    return null;
                }
            });
        });
    }
}
