import libVal from '../../Common/Library/ValidationLibrary';
export default function MaterialDescriptionFromMaterialSLoc(context) {
    if (!libVal.evalIsEmpty(context.binding.Material) && !libVal.evalIsEmpty(context.binding.Plant) && !libVal.evalIsEmpty(context.binding.StorageLocation)) {
        return context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            `MaterialSLocs(Plant='${context.binding.Plant}',StorageLocation='${context.binding.StorageLocation}',MaterialNum='${context.binding.Material}')`,
            [],
            '$expand=Material').then(result => {
                if (result && result.length > 0) {
                    //Grab the first row (should only ever be one row)
                    let row = result.getItem(0);
                    return context.binding.Material + ' - ' + row.Material.Description;
                }
                return context.binding.Material;
            });
    }
    return context.binding.Material;
}
