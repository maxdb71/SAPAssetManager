import libCom from '../../Common/Library/CommonLibrary';

export default function CalculateNewReceivedQuantity(context) {
    
    //When updating the local inventory item, add new quantity minus the old quantity (if this is an edit) to existing received or withdrawn quantity
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (type === 'PO' || type === 'RES') {
        return Number(context.binding.TempItem_ReceivedQuantity) + Number(context.binding.TempLine_EntryQuantity) - Number(context.binding.TempLine_OldQuantity);
    } else if (type === 'STO') {
        if (move === 'I') {
            return Number(context.binding.TempItem_ReceivedQuantity); //Issue, so do not update received
        }
        //Receipt
        return Number(context.binding.TempItem_ReceivedQuantity) + Number(context.binding.TempLine_EntryQuantity) - Number(context.binding.TempLine_OldQuantity);
    }
}
