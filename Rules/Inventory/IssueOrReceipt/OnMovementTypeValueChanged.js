import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';

export default function OnMovementTypeValueChanged(context) {
    let movementType = context.getValue();
    let glAccountSimple = context.getPageProxy().getControl('FormCellContainer').getControl('GLAccountSimple');
    let costCenterSimple = context.getPageProxy().getControl('FormCellContainer').getControl('CostCenterSimple');
    let wbSElementSimple = context.getPageProxy().getControl('FormCellContainer').getControl('WBSElementSimple');
    let orderSimple = context.getPageProxy().getControl('FormCellContainer').getControl('OrderSimple');
    let networkSimple = context.getPageProxy().getControl('FormCellContainer').getControl('NetworkSimple');
    let activitySimple = context.getPageProxy().getControl('FormCellContainer').getControl('ActivitySimple');
    let businessAreaSimple = context.getPageProxy().getControl('FormCellContainer').getControl('BusinessAreaSimple');

    glAccountSimple.setVisible(false);

    if (movementType && movementType.length > 0 && movementType[0].ReturnValue) {
        if (movementType[0].ReturnValue === '201') {
            costCenterSimple.setVisible(true);            
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
        } else if (movementType[0].ReturnValue === '221') {
            wbSElementSimple.setVisible(true);            
            costCenterSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
        } else if (movementType[0].ReturnValue === '261') {
            orderSimple.setVisible(true);
            costCenterSimple.setVisible(true);
            wbSElementSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
        } else if (movementType[0].ReturnValue === '281') {
            networkSimple.setVisible(true);
            activitySimple.setVisible(true);
            businessAreaSimple.setVisible(false);
            costCenterSimple.setVisible(false);
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            glAccountSimple.setVisible(true);
        } else if (movementType[0].ReturnValue === '301' || movementType[0].ReturnValue === '311') {
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);

            costCenterSimple.setVisible(false);
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);

            let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
            let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
            //let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
            let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
            let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
                
            let materialValue = '';
            let plantValue = '';
            let storageLocationValue = '';
            if (!(common.getPreviousPageName(context) === 'StockDetailsPage')) {
                if (matrialListPicker.getValue() && matrialListPicker.getValue().length > 0) {
                    materialValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).MaterialNum;
                    plantValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).Plant;
                    storageLocationValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).StorageLocation;
                }
            } else {
                materialValue = context.binding.MaterialNum;
                plantValue = context.binding.Plant;
                storageLocationValue = context.binding.StorageLocation;
            }
            
            storageLocationPicker.setEditable(false);
            if (materialValue && plantValue && storageLocationValue) {
                let movementTypeValue = movementType[0].ReturnValue;
                let plantToFilter = '';
                let storageLocationToFilter = '';
                let plantToEditable = true;
                let StorgeLocationEditable = false;
                let StorgeLocationToEditable = true;

                if (movementTypeValue === '301') { //plant to plant transfer
                    plantToFilter = `$filter=Plant ne '${plantValue}'&$orderby=Plant`;
                    plantToEditable = true;
                    StorgeLocationToEditable = false;
                } else if (movementTypeValue === '311') { //within plant transfer
                    plantToFilter = `$filter=Plant eq '${plantValue}'&$orderby=Plant`;
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    plantToEditable = false;
                    StorgeLocationToEditable = true;
                } 

                let storageLocationFromSpecifier = storageLocationPicker.getTargetSpecifier();
                storageLocationFromSpecifier.setQueryOptions(`$filter=MaterialNum eq '${materialValue}' and Plant eq '${plantValue}' and StorageLocation eq '${storageLocationValue}'&$orderby=StorageLocation`);
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
            }
        }
    }
}
