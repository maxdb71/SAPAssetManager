import libVal from '../../../../Common/Library/ValidationLibrary';

export default function OnStockTransferSerialNumberRemoved(context) {
    let serialNumber = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum').getValue();

    if (!libVal.evalIsEmpty(serialNumber)) {
        let serialNumbers = context.getPageProxy().getClientData().SerialNumbers;
        let serialNumListText = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListText');
        let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
        let newSerialNumbers = [];
        let updateQty = true;
        if (!libVal.evalIsEmpty(serialNumbers) && serialNumbers.length > 0) {
            let j = 0;
            for (var i = 0; i < serialNumbers.length; i++) {
                if (!(serialNumbers[i] === serialNumber)) {
                    newSerialNumbers[j] = serialNumbers[i];
                    j++;
                }
            }
            let serialNumbersText = '';
            for (var index = 0; index<newSerialNumbers.length; index++) {
                if (index === newSerialNumbers.length - 1) {
                    serialNumbersText = serialNumbersText + newSerialNumbers[index];
                } else  {
                    serialNumbersText = serialNumbersText + newSerialNumbers[index] + ',';
                }
            }
            context.getPageProxy().getClientData().SerialNumbers = newSerialNumbers;
            serialNumListText.setValue(serialNumbersText.trim());
            if (context.binding) {
                let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
                if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
                    updateQty = false;
                }
            }
            if (updateQty) {
                quantity.setValue(newSerialNumbers.length);
            }
            context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum').setValue('');
        }
    }
}
