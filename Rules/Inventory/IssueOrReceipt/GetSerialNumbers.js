export default function GetSerialNumbers(context) {
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            if (context.binding.SerialNum && context.binding.SerialNum.length > 0) {
                let serialNumbers = '';
                for (var i = 0; i<context.binding.SerialNum.length; i++) {
                    if (i === context.binding.SerialNum.length - 1) {
                        serialNumbers = serialNumbers + context.binding.SerialNum[i].SerialNum;
                    } else  {
                        serialNumbers = serialNumbers + context.binding.SerialNum[i].SerialNum + ',';
                    }
                }
                let serialNumbersArray = []; 
                if (serialNumbers.indexOf(',') > 0) {
                    serialNumbersArray = serialNumbers.split(',');
                } else {
                    serialNumbersArray.push(serialNumbers);
                }
                context.getPageProxy().getClientData().SerialNumbers = serialNumbersArray;
                return serialNumbers;
            }
        } else if (type === 'InboundDeliveryItem' ||  type === 'OutboundDeliveryItem') {
            let serialNumberObjects;
            if (context.binding.InboundDeliverySerial_Nav && context.binding.InboundDeliverySerial_Nav.length > 0) {
                serialNumberObjects = serialNumberObjects = context.binding.InboundDeliverySerial_Nav;
            } else if (context.binding.OutboundDeliverySerial_Nav && context.binding.OutboundDeliverySerial_Nav.length > 0) {
                serialNumberObjects = serialNumberObjects = context.binding.OutboundDeliverySerial_Nav;
            }

            if (serialNumberObjects && serialNumberObjects.length > 0) {
                let inboundOrOutboundserialNumbers = '';
                for (var j = 0; j<serialNumberObjects.length; j++) {
                    if (j === serialNumberObjects.length - 1) {
                        inboundOrOutboundserialNumbers = inboundOrOutboundserialNumbers + serialNumberObjects[j].SerialNumber;
                    } else  {
                        inboundOrOutboundserialNumbers = inboundOrOutboundserialNumbers + serialNumberObjects[j].SerialNumber + ',';
                    }
                }
                let inboundOrOutboundSerialNumbersArray = []; 
                if (inboundOrOutboundserialNumbers.indexOf(',') > 0) {
                    inboundOrOutboundSerialNumbersArray = inboundOrOutboundserialNumbers.split(',');
                } else {
                    inboundOrOutboundSerialNumbersArray.push(inboundOrOutboundserialNumbers);
                }
                context.getPageProxy().getClientData().SerialNumbers = inboundOrOutboundSerialNumbersArray;
                return inboundOrOutboundserialNumbers;
            }
        }
    }
    return '';
}
