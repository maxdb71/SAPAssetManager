import libVal from '../../Common/Library/ValidationLibrary';

export default function SerialNumberListPickerItems(context) {
    
    let serialNumbers = context.getPageProxy().getClientData().SerialNumbers;
    if (!libVal.evalIsEmpty(serialNumbers)) {
        return serialNumbers;
    }
    if (context.binding) {
        let target = context.binding;
        let newSerialNumbers = [];
        if (target.SerialNum && target.SerialNum.length > 0) {
            for (let index = 0; index < target.SerialNum.length; index++) {
                newSerialNumbers[index] = target.SerialNum[index].SerialNum;
            }
            return newSerialNumbers;
        }
    }
    return [];
}
