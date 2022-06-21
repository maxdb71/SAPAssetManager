import libCommon from '../../Common/Library/CommonLibrary';

export default function UninstallEquipmentChangeSet(context) {

    let equipments = context.getControl('FormCellContainer').getControl('EquipmentPicker').getValue();
    return libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Uninstall/UninstallEquipmentChangeSet.action', equipments).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/Uninstall/UninstallSuccess.action');
    });
}
