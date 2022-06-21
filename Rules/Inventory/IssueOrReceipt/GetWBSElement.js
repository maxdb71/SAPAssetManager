export default function GetWBSElement(context) {
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.WBSElement;
        } else if (type === 'ReservationItem') {
            return context.binding.WBSElement;
        }
    }
    return '';
}
