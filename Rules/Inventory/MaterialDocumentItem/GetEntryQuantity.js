export default function GetEntryQuantity(context) {
    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    
    return context.formatNumber(Number(binding.EntryQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.EntryUOM;
}

