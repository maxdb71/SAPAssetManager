import libCom from '../../Common/Library/CommonLibrary';

export default function ShowVendorMaterialNumber(context) {
    
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (move === 'I') { //Issue
        return false;
    }

    return true;
}
