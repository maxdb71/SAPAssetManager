export default function GetOrder(context) {

    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.OrderNumber;
        } else if (type === 'ReservationItem') {
            return context.binding.OrderId;
        }
    }
    return '';
}
