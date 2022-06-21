import listPickerValidation from '../../Common/Validation/ListPickerValidation';

export default function PartCreateMaterialUOM(context) {
    listPickerValidation(context); // clear validation error if any when the list is not empty
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return context.binding.UoM;
    }
    return context.binding.UnitOfMeasure;
}
