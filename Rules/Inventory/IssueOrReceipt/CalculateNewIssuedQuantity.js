import libCom from '../../Common/Library/CommonLibrary';

export default function CalculateNewIssuedQuantity(context) {
    
    //When updating the local inventory item, add new quantity minus the old quantity (if this is an edit) to existing issued quantity
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'STO') {
        if (move === 'I') {
            return Number(context.binding.TempItem_IssuedQuantity) + Number(context.binding.TempLine_EntryQuantity) - Number(context.binding.TempLine_OldQuantity);
        }
        return Number(context.binding.TempItem_IssuedQuantity); //This is a receipt, so do not change the number

    }
    return Promise.resolve(true); //No update necessary
 
}
