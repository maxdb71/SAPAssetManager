export default function GetReservationItemListQuantityText(context) {

    let ordered = context.binding.RequirementQuantity;
    let issued = context.binding.WithdrawalQuantity;
    let complete = context.binding.Completed;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    let orderedText = context.formatNumber(context.binding.RequirementQuantity, '', {maximumFractionDigits: decimals});
    let issuedText = context.formatNumber(context.binding.WithdrawalQuantity, '', {maximumFractionDigits: decimals});

    if (ordered - issued <= 0 || complete === 'X') {
        return context.localizeText('item_fully_posted');
    }
    return context.localizeText('item_open_quantities',[issuedText, orderedText, context.binding.RequirementUOM]);
}
