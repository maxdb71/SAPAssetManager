import libCom from '../../Common/Library/CommonLibrary';

export default function GetIssueOrReceiptCaption(context) {

    //Get the screen caption for receipt or issue create/edit
    let type = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (type === 'R') {
        if (objectType === 'IB' || objectType === 'OB') {
            return '$(L,delivery_item_title)';
        }
        return '$(L,po_item_receiving_title)';
    } else if (type === 'I') {
        if (objectType === 'TRF') {
            return '$(L,stock_transfer)';
        } else if (objectType === 'IB' || objectType === 'OB') {
            return '$(L,delivery_item_title)';
        }
        return '$(L,issue_item)';
    }
    return '';

}
