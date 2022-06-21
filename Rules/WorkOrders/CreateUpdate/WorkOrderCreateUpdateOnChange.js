import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateOnChange(control) {
    if (control.getName() === 'FuncLocHierarchyExtensionControl' || control.getName() === 'EquipHierarchyExtensionControl') {
        let change_flag = control.getPageProxy();
        let change_funcl = '000111014090'; //Some random value
        if (control.getName() === 'FuncLocHierarchyExtensionControl') {
            change_funcl = change_flag.getControls()[0].getControl('FuncLocHierarchyExtensionControl').getValue();
        }
        if (!change_funcl || change_funcl === '') {
            return;
        }
        LibWoEvent.createUpdateOnChange(control, true); // Set the isExtension optional flag to true if the rule is being called from extension control
    } else {
        LibWoEvent.createUpdateOnChange(control);
    }
}
