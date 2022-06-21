export default function InboundOutboundDeliveryQuantity(context) {
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    let pickedText = context.formatNumber(context.binding.PickedQuantity, '', {maximumFractionDigits: decimals});
    let quantityText = context.formatNumber(context.binding.Quantity, '', {maximumFractionDigits: decimals});

    return context.localizeText('item_open_quantities',[pickedText,quantityText,context.binding.UOM]);
}
