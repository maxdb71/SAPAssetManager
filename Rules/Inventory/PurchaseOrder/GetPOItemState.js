export default function GetPOItemState(clientAPI) {
    let binding = clientAPI.getBindingObject();
    let received = binding.ReceivedQuantity;
    let ordered = binding.OrderQuantity;

    if (binding.DeliveryCompletedFlag === 'X' || binding.FinalDeliveryFlag === 'X') {
        return clientAPI.localizeText('item_full');
    }

    if (ordered === 0 || received === 0) {
        return clientAPI.localizeText('item_empty');
    }

    if (ordered - received > 0) {
        return clientAPI.localizeText('item_partial');
    }

    return clientAPI.localizeText('item_full');
}
