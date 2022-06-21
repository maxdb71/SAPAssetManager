export default function InspectionCharacteristicsUpdateQueryOptions(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionLot' || context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return '$expand=MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar';
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return `$filter=EAMChecklist_Nav/OperationNo eq '${context.binding.OperationNo}' and EAMChecklist_Nav/OrderId eq '${context.binding.OrderId}'&$expand=MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar`;
    } else if (context.binding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
        return '$expand=EAMChecklist_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar';
    }
    return '';
}
