import libCom from '../Common/Library/CommonLibrary';
export default function UnloadingPointVisible(context) {
	let type = libCom.getStateVariable(context, 'IMObjectType');
	if (type === 'IB' || type === 'OB') {
		return false;
	} else {
		let move = libCom.getStateVariable(context, 'IMMovementType');
		if (move === 'I') { //Issue
			return false;
		}
		return true;
	}
}
