export default function PartWorkOrderIsEditable(context) {
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return true;
    }
    return false;
}
