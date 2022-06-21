import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function GetPurchaseOrderItemsOpenQuantitiesText(context) {

    let ordered, orderedText;
    let received, receivedText;
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let complete = false;
    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    ordered = binding.OrderQuantity;
    orderedText = context.formatNumber(binding.OrderQuantity, '', {maximumFractionDigits: decimals});
    received = binding.ReceivedQuantity;
    receivedText = context.formatNumber(binding.ReceivedQuantity, '', {maximumFractionDigits: decimals});

    if (type === 'StockTransportOrderItem') {
        if (allowIssue(context)) { //Issue
            ordered = binding.OrderQuantity;
            orderedText = context.formatNumber(binding.OrderQuantity, '', {maximumFractionDigits: decimals});
            received = binding.IssuedQuantity;
            receivedText = context.formatNumber(binding.IssuedQuantity, '', {maximumFractionDigits: decimals});
        } else { //Receipt
            ordered = binding.IssuedQuantity;
            orderedText = context.formatNumber(binding.IssuedQuantity, '', {maximumFractionDigits: decimals});
            received = binding.ReceivedQuantity;
            receivedText = receivedText = context.formatNumber(binding.ReceivedQuantity, '', {maximumFractionDigits: decimals});
            if (ordered === 0) { //STO case when nothing has been issued yet, but document shows up on receiving user's device
                return context.localizeText('item_open_quantities',[receivedText,orderedText,binding.OrderUOM]);
            }
        }
    }
    if (binding.DeliveryCompletedFlag || binding.FinalDeliveryFlag) {
        complete = true;
    }
    if (ordered - received <= 0 || complete) {
        return context.localizeText('item_fully_posted');
    }
    return context.localizeText('item_open_quantities',[receivedText,orderedText,binding.OrderUOM]);
    
}
