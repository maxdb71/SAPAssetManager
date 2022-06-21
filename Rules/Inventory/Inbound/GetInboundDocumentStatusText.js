
/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetInboundDocumentStatusText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue = null;

    if (binding.PurchaseOrderHeader_Nav) {
        statusValue = binding.PurchaseOrderHeader_Nav.DocumentStatus;
    } else if (binding.InboundDelivery_Nav) { 
        statusValue = binding.InboundDelivery_Nav.GoodsMvtStatus;
    } else if (binding.OutboundDelivery_Nav) { 
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
            return clientAPI.localizeText('inbound_document_partial');
        case 'C':
            return clientAPI.localizeText('inbound_document_completed');
        default:
            return clientAPI.localizeText('open');
    }
}
