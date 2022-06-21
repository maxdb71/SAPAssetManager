
import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionCharacteristicsFDCFilter(context) {

    let sections = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer')._control.sectionsContexts;
    let equipments = [];
    let funcLocs = [];
    let operations =[];

    if (sections && sections.length > 0) {
        for (let section of sections) {
            let odataType = section.binding['@odata.type'];
            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                let equipId = section.binding.EAMChecklist_Nav.Equipment;
                let funcLoc = section.binding.EAMChecklist_Nav.FunctionalLocation;
                let operationNum = section.binding.EAMChecklist_Nav.OperationNo;

                if (!libVal.evalIsEmpty(equipId) && !equipments.includes(equipId)) {
                    equipments.push(equipId);
                }

                if (!libVal.evalIsEmpty(funcLoc) && !funcLocs.includes(funcLoc)) {
                    funcLocs.push(funcLoc);
                }

                if (!libVal.evalIsEmpty(operationNum) && !operations.includes(operationNum)) {
                    operations.push(operationNum);
                }
            }
        }
    }
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipments = equipments;
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLocs = funcLocs;
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Operations = operations;
    return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilterNav.action');

}
