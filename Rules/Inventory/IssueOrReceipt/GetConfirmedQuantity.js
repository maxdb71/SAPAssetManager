import libCom from '../../Common/Library/CommonLibrary';

export default function GetConfirmedQuantity(context) {

    let binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let oldQuantity = 0;

        if (type === 'MaterialDocItem') { //Redirect binding to point to the underlying inventory object
            if (context.binding.PurchaseOrderItem_Nav) {
                binding = context.binding.PurchaseOrderItem_Nav;
                type = 'PurchaseOrderItem';
            } else if (context.binding.StockTransportOrderItem_Nav) {
                binding = context.binding.StockTransportOrderItem_Nav;
                type = 'StockTransportOrderItem';
            } else if (context.binding.ReservationItem_Nav) {
                binding = context.binding.ReservationItem_Nav;
                type = 'ReservationItem';
            }
            oldQuantity = Number(context.binding.EntryQuantity);
        } else {
            binding = context.binding; //Use the inventory object we already have
        }
        
        if (type === 'PurchaseOrderItem') {
            return context.formatNumber(Number(binding.ReceivedQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM;
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return context.formatNumber(Number(binding.ReceivedQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM;
            }
            return context.formatNumber(Number(binding.IssuedQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM; //Issue
        } else if (type === 'ReservationItem') {
            return context.formatNumber(Number(binding.WithdrawalQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.RequirementUOM;
        }
    }
    return '';
}
