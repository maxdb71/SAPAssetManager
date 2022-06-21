import showAuto from './ShowAutoSerialNumberField';

export default function IsQuantityEditable(context) {

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return false;
        }
    }

    return showAuto(context).then(function(show) { //If not serial enabled, then quantity is editable
        return !show;
    });
}
