import Reservation from '../Reservation/Reservation';
import common from '../../Common/Library/CommonLibrary'; 

export default function GetOutboundDocumentRecipientText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    
    if (binding.OutboundDelivery_Nav) {
        let receivingPlant = binding.OutboundDelivery_Nav.ReceivingPlant;
        let shipToParty = binding.OutboundDelivery_Nav.ShipToParty;

        if (receivingPlant) {
            return common.getPlantName(clientAPI, receivingPlant);
        } else if (shipToParty) {
            return common.getCustomerName(clientAPI, shipToParty);
        }
    } else if (binding.ReservationHeader_Nav) {
        let reservation = new Reservation(clientAPI, binding.ReservationHeader_Nav);
        let recipient = reservation.getRecipient();
        return recipient;
    } else if (binding.StockTransportOrderHeader_Nav) {
        let supplyingPlant = binding.StockTransportOrderHeader_Nav.SupplyingPlant;

        if (supplyingPlant) {
            return common.getPlantName(clientAPI, supplyingPlant);
        }
    }

    return '';
}

