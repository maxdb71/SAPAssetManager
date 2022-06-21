import libCom from '../../Common/Library/CommonLibrary';

export default function CalculateNewOpenQuantity(context) {
    
    let type = libCom.getStateVariable(context, 'IMObjectType');

    if (type === 'STO') {
        return Number(context.binding.TempItem_OpenQuantity); //Open is unused on client for STO
    }

    //Subtract new quantity from previously open adding old quantity (if this was an edit)
    return Number(context.binding.TempItem_OpenQuantity) - Number(context.binding.TempLine_EntryQuantity) + Number(context.binding.TempLine_OldQuantity);
    
}
