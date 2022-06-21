import libCom from '../../Common/Library/CommonLibrary';

export default function GetOrderedQuantityCaption(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');

    if (type === 'PO' || type === 'STO') {
        return '$(L,po_item_detail_requested)';
    } else if (type === 'RES') {
        return '$(L,reservation_item_requirement_qty)';
    } else if (type === 'IB' || type === 'OB') {
        return '$(L, delivery_quatity)';
    } else {
        return '';
    }
}
