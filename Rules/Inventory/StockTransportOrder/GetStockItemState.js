import allowIssue from './AllowIssueForSTO';

export default function GetStockItemState(clientAPI) {
    let binding = clientAPI.getBindingObject();    
    let issued = binding.IssuedQuantity;
    let received = binding.ReceivedQuantity;
    let ordered = binding.OrderQuantity;

    if (binding.DeliveryCompletedFlag === 'X' || binding.FinalDeliveryFlag === 'X') {
        return clientAPI.localizeText('item_full');
    }

    if (allowIssue(clientAPI)) {
        if (ordered === 0 || issued === 0) {
            return clientAPI.localizeText('item_empty');
        }

        if (ordered - issued > 0) {
           return clientAPI.localizeText('item_partial');
        }
    } else {
        if (ordered === 0 || received === 0) {
            return clientAPI.localizeText('item_empty');
        }

        if (ordered - received > 0) {
            return clientAPI.localizeText('item_partial');
        }
    }

    return clientAPI.localizeText('item_full');
}
