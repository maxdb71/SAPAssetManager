import libVal from '../../Common/Library/ValidationLibrary';

export default function MaterialNumberReadLink(context) {
    let material = '';
    let plant = '';
    let storageLocation = '';
    if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.RelatedItem)) {
        plant = context.binding.RelatedItem[0].Plant;
        storageLocation = context.binding.RelatedItem[0].StorageLocation;
        material = context.binding.RelatedItem[0].Material;
    } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MaterialDocItem') {
        plant = context.binding.Plant;
        storageLocation = context.binding.StorageLocation;
        material = context.binding.Material;
    }
    if (!libVal.evalIsEmpty(material) && !libVal.evalIsEmpty(plant) && !libVal.evalIsEmpty(storageLocation) ) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MaterialSLocs(Plant='${plant}',StorageLocation='${storageLocation}',MaterialNum='${material}')`, [], '').then(result => {
            if (result.length > 0) {
                return result.getItem(0)['@odata.readLink'];
            }
            return '';
        });
    }
    return '';
}
