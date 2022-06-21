import libCommon from '../../Common/Library/CommonLibrary';

export default function EquipmentInstallationChangeSet(context) {

    let equipmentPreviousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (!libCommon.getPageName(equipmentPreviousPage) === 'EquipmentDetailsPage') {
        let isFromErrorArchive = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:FromErrorArchive'); 
        if (isFromErrorArchive === true) { 
            context.executeAction('/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationDeleteChangeSet.action');
        }
    } 

    let equipments = context.getControl('FormCellContainer').getControl('EquipmentPicker').getValue();
    return libCommon.CallActionWithPickerItems(context, '/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationChangeSet.action', equipments).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallClosePage.action');
    });
}
