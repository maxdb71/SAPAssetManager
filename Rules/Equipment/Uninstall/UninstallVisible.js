import enableDismantleButtonForFlocation from '../../UserAuthorizations/FunctionalLocations/EnableFunctionalLocationEdit';
import enableDismantleButtonForEquipment from '../../UserAuthorizations/Equipments/EnableEquipmentEdit';

export default function UninstallVisible(context) {
    let query = context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation' ?
        `$filter=FunctionalLocation/FuncLocId eq '${context.binding.FuncLocId}'` :
        `$filter=SuperiorEquip eq '${context.binding.EquipId}'`;

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', query).then(function(count) {
        if (count > 0) {
            return (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') ? enableDismantleButtonForFlocation(context) : enableDismantleButtonForEquipment(context);
        } else {
            return false;
        }
    });
}
