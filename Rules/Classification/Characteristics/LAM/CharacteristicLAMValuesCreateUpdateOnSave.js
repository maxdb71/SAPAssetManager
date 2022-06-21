import libCommon from '../../../Common/Library/CommonLibrary';


export default function CharacteristicLAMValuesCreateUpdateOnSave(pageProxy) {
    let onCreate = libCommon.IsOnCreate(pageProxy);

    if (onCreate) {
        return pageProxy.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/LAM/CharacteristicLAMValuesCreate.action');
    } else {
        return pageProxy.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/LAM/CharacteristicLAMValuesUpdate.action');
    }

}
