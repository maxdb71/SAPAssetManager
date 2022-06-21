import libCom from '../../Common/Library/CommonLibrary';

export default function ShowMaterialTransferToFields(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
     
    if (type === 'ADHOC' || type === 'TRF') {
        return true;
    }

    return false;
}
