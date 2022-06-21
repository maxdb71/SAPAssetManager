import common from '../../Common/Library/CommonLibrary';
import Reservation from '../Reservation/Reservation';
 
export default function GetInboundDocumentVendorText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    
    if (binding) {
        switch (binding.IMObject) {
            case 'ST':
                if (binding.StockTransportOrderHeader_Nav.SupplyingPlant) {
                    return common.getPlantName(clientAPI, binding.StockTransportOrderHeader_Nav.SupplyingPlant);
                }
                break;
            case 'PO':
                if (binding.PurchaseOrderHeader_Nav.Vendor) {
                    return common.getVendorName(clientAPI, binding.PurchaseOrderHeader_Nav.Vendor);
                }
                break;
            case 'IB':
                if (binding.InboundDelivery_Nav.Vendor) {
                    return common.getVendorName(clientAPI, binding.InboundDelivery_Nav.Vendor);
                }
                break;
            case 'OB':
                if (binding.OutboundDelivery_Nav.ReceivingPlant) {
                    return common.getPlantName(clientAPI, binding.OutboundDelivery_Nav.ReceivingPlant);
                }
                break;
            case 'RS':
                if (binding.OutboundDelivery_Nav) {
                    var receivingPlant = binding.OutboundDelivery_Nav.ReceivingPlant;
                    var shipToParty = binding.OutboundDelivery_Nav.ShipToParty;
            
                    if (receivingPlant) {
                        return common.getPlantName(clientAPI, receivingPlant);
                    } else if (shipToParty) {
                        return common.getCustomerName(clientAPI, shipToParty);
                    }
            
                } else if (binding.ReservationHeader_Nav) {
                    var reservation = new Reservation(clientAPI, binding.ReservationHeader_Nav);
                    var recipient = reservation.getRecipient();
                    return recipient;
                }
        }
    }

    return '';
}

