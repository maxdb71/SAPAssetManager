import libCom from '../Common/Library/CommonLibrary';

export default function DeliveryCompleteVisible(context) {
	let type = libCom.getStateVariable(context, 'IMObjectType');
	if (type === 'PO' || type === 'STO' || type === 'RES') {
        return true;
    }
    return false;
}
