import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function GetStorageLocation(context) {

    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem' || type === 'MaterialSLoc' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return context.binding.StorageLocation;
        } else if (type === 'PurchaseOrderItem') {
            return context.binding.StorageLoc;
        } else if (type === 'StockTransportOrderItem') {
            if (allowIssue(context)) { //Issue so no default
                return '';
            } else {
                return context.binding.StorageLoc; //Receipt, so use item default
            }
        } else if (type === 'ReservationItem') {
            return context.binding.SupplyStorageLocation;
        } 
    }
    return '';

}
