
/**
 * Calculates the text for the status property at the Outbound List screen
 */
 
export default function GetOutboundStatusText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue = null;

    if (binding.OutboundDelivery_Nav) {
        statusValue = binding.OutboundDelivery_Nav.GoodsMvtStatus;
    } else if (binding.ReservationHeader_Nav) { 
        statusValue = binding.ReservationHeader_Nav.DocumentStatus;
    } else if (binding.StockTransportOrderHeader_Nav) { 
        statusValue = binding.StockTransportOrderHeader_Nav.DocumentStatus;  
    }

    switch (statusValue) {
        case 'A':
            return clientAPI.localizeText('open');
        case 'B':
            return clientAPI.localizeText('outbound_document_partial');
        case 'C':
            return clientAPI.localizeText('outbound_document_completed');
        default:
            return clientAPI.localizeText('open');
    }
}
