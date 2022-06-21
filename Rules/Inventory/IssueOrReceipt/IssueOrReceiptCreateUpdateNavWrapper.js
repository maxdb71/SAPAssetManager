import libCom from '../../Common/Library/CommonLibrary';
import isEnabled from '../Validation/IssueOrReceiptIsAllowed';

export default function IssueOrReceiptCreateUpdateNavWrapper(context) {

    if (isEnabled(context)) {

        let parent = libCom.getStateVariable(context, 'IMObjectType');
        //Figure out binding properties
        libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
        libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
        libCom.removeStateVariable(context, 'ReceiveAllItemId');

        var actionBinding = context.getPageProxy().getActionBinding();

        let type = actionBinding['@odata.type'].substring('#sap_mobile.'.length);
        var target;
        var targetField;
        var query = '';

        if (type === 'MaterialDocItem') {
            query = `$filter=sap.islocal() and MatDocItem eq '${actionBinding.MatDocItem}' and MaterialDocNumber eq '${actionBinding.AssociatedMaterialDoc.MaterialDocNumber}' and MaterialDocYear eq '${actionBinding.AssociatedMaterialDoc.MaterialDocYear}'&$expand=AssociatedMaterialDoc&$top=1`;
        } else { //Item
            if (parent === 'PO') {
                target = actionBinding.PurchaseOrderId;
                targetField = 'PurchaseOrderNumber';
            } else if (parent === 'STO') {
                target = actionBinding.StockTransportOrderId;
                targetField = 'PurchaseOrderNumber';
            } else if (parent === 'RES') {
                target = actionBinding.ReservationNum;
                targetField = 'ReservationNumber';
            }
            query = '$filter=sap.islocal() and ' + targetField + " eq '" + target + "'&$expand=AssociatedMaterialDoc&$top=1";
        }

        actionBinding.TempHeader_DocumentDate = '';
        actionBinding.TempHeader_HeaderText = '';
        actionBinding.TempHeader_DeliveryNote = '';
    
        //Check to see if there is a local material document item tied to parent
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MaterialDocNumber'], query).then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink',row.AssociatedMaterialDoc['@odata.readLink']);
                libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber',row.MaterialDocNumber);
                actionBinding.TempHeader_DocumentDate = row.AssociatedMaterialDoc.DocumentDate;
                actionBinding.TempHeader_HeaderText = row.AssociatedMaterialDoc.HeaderText;
                actionBinding.TempHeader_DeliveryNote = row.AssociatedMaterialDoc.RefDocumentNumber;
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateNav.action');
            }
            //Create a new material document for this PO/STO/RES
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
        });
    } 
}
