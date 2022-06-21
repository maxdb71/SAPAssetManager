import libVal from '../../../../Common/Library/ValidationLibrary';

export default function OnStockTransferSerialNumberAdded(context) {
    let serialNumber = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum').getValue();
    if (!libVal.evalIsEmpty(serialNumber)) {
        let updateQty = true;
        serialNumber = serialNumber.replace(/\s/g, '');
        let serialNumbers = context.getPageProxy().getClientData().SerialNumbers;
        let serialNumListText = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListText');
        //let serialNumListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListPicker');
        let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
        // if (!libVal.evalIsEmpty(serialNumList.getValue())) {
        //     serialNumList.setValue(serialNumList.getValue() + ',' + serialNumber);
        // } else {
        //     serialNumList.setValue(serialNumber);
        // }
        if (libVal.evalIsEmpty(serialNumbers)) {
            serialNumbers = [];
        }
        let serialNumberExists = false;
        for (var i = 0; i < serialNumbers.length; i++) {
            if (serialNumbers[i] === serialNumber) {
                serialNumberExists = true;
            }
        }
        if (!serialNumberExists) {
            serialNumbers.push(`${serialNumber}`);
        }
        context.getPageProxy().getClientData().SerialNumbers = serialNumbers;
        let serialNumbersText = '';
        for (var index = 0; index<serialNumbers.length; index++) {
            if (index === serialNumbers.length - 1) {
                serialNumbersText = serialNumbersText + serialNumbers[index];
            } else  {
                serialNumbersText = serialNumbersText + serialNumbers[index] + ',';
            }
        }
        serialNumListText.setValue(serialNumbersText.trim());
        //serialNumListPicker.setValue().push({DisplayValue: serialNumber, ReturnValue: serialNumber});
        //serialNumListPicker.redraw();
        // serialNumListPicker.reset();
        // sleep(200).then(function() {
        //     serialNumListPicker.setValue(serialNumbers);
        // });
        if (context.binding) {
            let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
            if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
                updateQty = false;
            }
        }
        if (updateQty) {
            quantity.setValue(serialNumbers.length);
        }
        quantity.setEditable(false);
        context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum').setValue('');
    }
}

// function sleep(ms) {
//     return (new Promise((resolve) => {        
//         setTimeout(function() { 
//             resolve(); 
//         }, ms);        
//     }));    
// }
