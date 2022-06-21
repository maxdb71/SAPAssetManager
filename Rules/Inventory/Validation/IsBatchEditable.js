import libCom from '../../Common/Library/CommonLibrary';

export default function IsBatchEditable(context) {
    let editable = true;
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        editable = false;
    }

    return editable;
}
