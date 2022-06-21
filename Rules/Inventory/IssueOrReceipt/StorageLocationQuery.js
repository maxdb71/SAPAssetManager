import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function StorageLocationQuery(context) {

    if (context.binding) {
        let plant;

        let binding = context.binding;
        let type = binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            plant = binding.Plant;
        } else if (type === 'PurchaseOrderItem' || type === 'MaterialSLoc') {
            plant = binding.Plant;
        } else if (type === 'StockTransportOrderItem') {
            if (allowIssue(context)) { //Issue so use supply plant
                plant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            } else {
                plant = binding.Plant;
            }
        } else if (type === 'ReservationItem') {
            plant = binding.SupplyPlant;
        }        
        return "$filter=Plant eq '" + plant + "'&$orderby=StorageLocation";
    }
    return "$filter=Plant eq '-1'"; //Empty list

}
