import materialName from '../PurchaseOrder/GetMaterialName';

export default function GetMaterialDescription(context) {
    if (context.binding) {
        return materialName(context).then((result) => {
            let chain = '';
            if (result) {
                chain = ' - ';
            }
            let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
            if (type === 'MaterialDocItem'  || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
                return context.binding.Material + chain + result;
            }
            return context.binding.MaterialNum + chain + result;
        });
    }
    return '';
}
