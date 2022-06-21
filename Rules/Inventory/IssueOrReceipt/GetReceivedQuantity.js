import libCom from '../../Common/Library/CommonLibrary';

export default function GetReceivedQuantity(context) {

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (binding) {
        if (type === 'MaterialDocItem') {
            //Get from associated PO/STO/RESV line item
            return context.formatNumber(Number(binding.EntryQuantity), '', {maximumFractionDigits: decimals});
        } else if (type === 'PurchaseOrderItem') {
            return context.formatNumber(Number(binding.OrderQuantity) - Number(binding.ReceivedQuantity), '', {maximumFractionDigits: decimals});
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return context.formatNumber(Number(binding.IssuedQuantity) - Number(binding.ReceivedQuantity), '', {maximumFractionDigits: decimals});
            }
            return context.formatNumber(Number(binding.OrderQuantity) - Number(binding.IssuedQuantity), '', {maximumFractionDigits: decimals}); //Issue
        } else if (type === 'ReservationItem') {
            return context.formatNumber(Number(binding.RequirementQuantity) - Number(binding.WithdrawalQuantity), '', {maximumFractionDigits: decimals});
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            if (context.binding.InboundDeliverySerial_Nav && context.binding.InboundDeliverySerial_Nav.length > 0) {
                return context.binding.InboundDeliverySerial_Nav.length;
            } else if (context.binding.OutboundDeliverySerial_Nav && context.binding.OutboundDeliverySerial_Nav.length > 0) {
                return context.binding.OutboundDeliverySerial_Nav.length;
            }

            if (Number(binding.PickedQuantity) > 0) {
                return context.formatNumber(Number(binding.PickedQuantity), '', {maximumFractionDigits: decimals});
            }
            return context.formatNumber(Number(binding.Quantity), '', {maximumFractionDigits: decimals});
        }
    }
    
    return '';
}
