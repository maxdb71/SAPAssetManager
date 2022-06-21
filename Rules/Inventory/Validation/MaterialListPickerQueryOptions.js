import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialListPickerQueryOptions(context) {
    let type;
    
    if (!libVal.evalIsEmpty(context.binding)) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            return `$filter=Plant eq '${context.binding.Plant}' and StorageLocation eq '${context.binding.StorageLocation}' and MaterialNum eq '${context.binding.Material}'&$expand=Material/MaterialPlants,Material/MaterialBatch_Nav&$orderby=MaterialNum,Plant,StorageLocation`;
        }
    }

    return '$expand=Material/MaterialPlants,Material/MaterialBatch_Nav&$orderby=MaterialNum,Plant,StorageLocation';
}
