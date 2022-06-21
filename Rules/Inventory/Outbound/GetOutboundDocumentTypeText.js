import Reservation from '../Reservation/Reservation';

/**
 * Calculates the text for the footnote property at the Outbound List screen
 */
 
export default function GetOutboundDocumentTypeText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    
    if (binding.OutboundDelivery_Nav) {
        return clientAPI.localizeText('outbound_delivery'); 
    } else if (binding.ReservationHeader_Nav) {
        var reservation = new Reservation(clientAPI, binding.ReservationHeader_Nav);
        var typeDesc = reservation.getDocumentTypeDesc();
        return typeDesc;
    } else if (binding.StockTransportOrderHeader_Nav) {
        return clientAPI.localizeText('stock_transport_order');
    }
	
}
