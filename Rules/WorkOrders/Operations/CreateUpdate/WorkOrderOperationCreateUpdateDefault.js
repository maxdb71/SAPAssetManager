import WorkCenterControl from '../../../Common/Controls/WorkCenterControl';
import WorkCenterPlant from '../../../Common/Controls/WorkCenterPlantControl';
import EquipFLocIsAllowed from '../WorkOrderOperationIsEquipFuncLocAllowed';
import { PrivateMethodLibrary as libPrivate } from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateDefault(control) {
    let controlName = control.getName();

    switch (controlName) {
        case 'EquipHierarchyExtensionControl': {
            let extension = control.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl')._control._extension;
            ///First we need to check ObjectListAssignment to deternine if we can add FLOC/Equip
            return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
                if (result === true) {
                    /// Set the Equipment picker using the Header or Operation Functional Location
                    if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                        extension.setData(control.getPageProxy().binding.HeaderEquipment);
                    } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                        extension.setData(control.getPageProxy().binding.OperationEquipment);
                    } else { //Default operation during WO add                    
                        let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);                        
                        return parentWorkOrderPromise.then(parentWorkOrder => {
                            if (parentWorkOrder && parentWorkOrder.Equipment) {
                                extension.setData(parentWorkOrder.Equipment);
                            }
                            return Promise.resolve(true);
                        });
                    }
                } else {
                    extension.setEditable(false);
                }
                return Promise.resolve(true);
            });
        }
        case 'FuncLocHierarchyExtensionControl': {
            let extension = control.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl')._control._extension;
            ///Check ObjectListAssignment same as above
            return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
                if (result === true) {
                    /// Set the FLOC picker using the Header or Operation Functional Location
                    if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                        extension.setData(control.getPageProxy().binding.HeaderFunctionLocation);
                    } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                        extension.setData(control.getPageProxy().binding.OperationFunctionLocation);
                    } else { //Default operation during WO add                    
                        let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);                        
                        return parentWorkOrderPromise.then(parentWorkOrder => {
                            if (parentWorkOrder && parentWorkOrder.FunctionalLocation) {
                                extension.setData(parentWorkOrder.FunctionalLocation);
                            }
                            return Promise.resolve(true);
                        });
                    }
                }  else {
                    extension.setEditable(false);
                }
                return Promise.resolve(true);

            });
        }
        case 'WorkCenterLstPkr':
            return WorkCenterControl.getOperationPageDefaultValue(control);
        case 'WorkCenterPlantLstPkr':
            return WorkCenterPlant.getOperationPageDefaultValue(control);
        case 'DescriptionNote':
            //Default description from parent work order or operation
            if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                return control.getPageProxy().binding.OrderDescription;
            } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return control.getPageProxy().binding.OperationShortText;
            } else { //Default operation during WO add                    
                let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);                        
                return parentWorkOrderPromise.then(parentWorkOrder => {
                    if (parentWorkOrder && parentWorkOrder.Description) {
                        return parentWorkOrder.Description;
                    }
                    return '';                                    
                });
            }
        default:
            return '';
    }
}
