export default function GetReservationItemState(clientAPI) {
    let binding = clientAPI.getBindingObject();    
    let received = binding.WithdrawalQuantity;
    let ordered = binding.RequirementQuantity;
    let complete = binding.Completed;

    if (complete === 'X') {
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
