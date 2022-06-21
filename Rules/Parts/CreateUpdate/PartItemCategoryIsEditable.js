export default function PartItemCategoryIsEditable(context) {
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return false;
    }
    return true;
}
