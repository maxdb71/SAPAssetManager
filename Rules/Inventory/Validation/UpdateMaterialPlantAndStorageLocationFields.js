import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function UpdateMaterialPlantAndStorageLocationFields(context) {

    if (context.getValue().length > 0) {
        let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
        let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
        let uom = context.getPageProxy().getControl('FormCellContainer').getControl('UOMSimple');
        let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
        let batch = context.getPageProxy().getControl('FormCellContainer').getControl('BatchSimple');
        let batchTo = context.getPageProxy().getControl('FormCellContainer').getControl('BatchNumTo');
        let autoSerialNumberSwitch = context.getPageProxy().getControl('FormCellContainer').getControl('AutoSerialNumberSwitch');
        let serialNum = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum');
        //let serialNumAdd = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumAdd');
        //let serialNumRemove = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumRemove');
        let myExtensionControlName = context.getPageProxy().getControl('FormCellContainer').getControl('MyExtensionControlName');
        let serialNumList = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListText');
        let storageBin = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
        let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
        let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
        let movementTypePicker = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');

        let materialVaue = SplitReadLink(context.getValue()[0].ReturnValue).MaterialNum;
        let plantVaue = SplitReadLink(context.getValue()[0].ReturnValue).Plant;
        let storageLocationValue = SplitReadLink(context.getValue()[0].ReturnValue).StorageLocation;
        let uomValue = '';
        let serial = false;
        let storageBinValue = '';
        let batchIndicatorFlag = false;
        let quantityFlag = true;
        let movementTypeValue = '';
        if (movementTypePicker.getValue().length > 0) {
            movementTypeValue = movementTypePicker.getValue()[0].ReturnValue;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getValue()[0].ReturnValue, [], '$expand=Material,MaterialPlant').then(result => {
            if (result && result.length > 0) {
                let materialSLoc = result.getItem(0);
                if (materialSLoc.MaterialPlant.BatchIndicator === 'X') {
                    batchIndicatorFlag = true;
                }
                if (!(materialSLoc.MaterialPlant.SerialNumberProfile === '')) {
                    serial = true;
                    quantityFlag = false;
                }
                uomValue = materialSLoc.Material.BaseUOM;
                storageBinValue = materialSLoc.StorageBin;

            }
            return common.getPlantName(context, plantVaue).then(function(plantResult) {
                plant.setValue(plantResult);
                batch.setVisible(batchIndicatorFlag);
                batchTo.setVisible(batchIndicatorFlag);
                uom.setValue(uomValue);
                storageBin.setValue(storageBinValue);
                autoSerialNumberSwitch.setVisible(serial);
                serialNum.setVisible(serial);
                quantity.setEditable(quantityFlag);
                //serialNumAdd.setVisible(serial);
                //serialNumRemove.setVisible(serial);
                myExtensionControlName.setVisible(serial);
                serialNumList.setVisible(serial);

                let plantToFilter = '';
                let storageLocationToFilter = '';
                let plantToEditable = true;
                let StorgeLocationEditable = false;
                let StorgeLocationToEditable = true;
                if (movementTypeValue === '301') { //plant to plant transfer
                    plantToFilter = `$filter=Plant ne '${plantVaue}'&$orderby=Plant`;
                    plantToEditable = true;
                    StorgeLocationToEditable = false;
                } else if (movementTypeValue === '311') { //within plant transfer
                    plantToFilter = `$filter=Plant eq '${plantVaue}'&$orderby=Plant`;
                    storageLocationToFilter = `$filter=Plant eq '${plantVaue}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    plantToEditable = false;
                    StorgeLocationToEditable = true;
                } 

                let storageLocationFromSpecifier = storageLocationPicker.getTargetSpecifier();
                storageLocationFromSpecifier.setQueryOptions(`$filter=MaterialNum eq '${materialVaue}' and Plant eq '${plantVaue}' and StorageLocation eq '${storageLocationValue}'&$orderby=StorageLocation`);
                storageLocationFromSpecifier.setEntitySet('MaterialSLocs');
                storageLocationFromSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                storageLocationPicker.setEditable(StorgeLocationEditable);
                storageLocationPicker.setTargetSpecifier(storageLocationFromSpecifier);
                storageLocationPicker.redraw();

                let plantToSpecifier = planToListPicker.getTargetSpecifier();
                plantToSpecifier.setQueryOptions(plantToFilter);
                plantToSpecifier.setEntitySet('Plants');
                plantToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                planToListPicker.setEditable(plantToEditable);
                planToListPicker.setTargetSpecifier(plantToSpecifier);
                planToListPicker.redraw();
                
                let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
                storageLocationToSpecifier.setQueryOptions(storageLocationToFilter);
                storageLocationToSpecifier.setEntitySet('StorageLocations');
                storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                storageLocationToListPicker.setEditable(StorgeLocationToEditable);
                storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
                storageLocationToListPicker.redraw();
            });
            
        });       
    }
}
