import common from '../../Common/Library/CommonLibrary';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
/**
 * This function returns the plant object header field on PurchaseOrderItemDetails page
 */
export default function GetPlantName(context) {

    let type;
    
    if (context.binding) {
        let binding = context.binding;
        type = binding['@odata.type'].substring('#sap_mobile.'.length);
        let plant;

        if (type === 'MaterialDocItem' || type === 'PurchaseOrderItem' || type === 'MaterialSLoc') {
            plant = binding.Plant;
        } else if (type === 'StockTransportOrderItem') { 
            if (allowIssue(context)) { //Issue so use supply plant
                plant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;
            } else {
                plant = binding.Plant;
            }
        } else if (type === 'ReservationItem') {
            plant = binding.SupplyPlant;
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return binding.Plant;
        }

        return common.getPlantName(context, plant);
    }
    return '';
}
