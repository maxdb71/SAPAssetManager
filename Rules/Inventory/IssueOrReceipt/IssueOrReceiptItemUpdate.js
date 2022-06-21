import libCom from '../../Common/Library/CommonLibrary';

/**
 * 
 * Update the inventory item object quantities after mat doc item add/edit
 */
export default function IssueOrReceiptItemUpdate(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    
    if (type === 'PO') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptPurchaseOrderItemUpdate.action');
    } else if (type === 'STO') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptSTOItemUpdate.action');
    } else if (type === 'RES') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptReservationItemUpdate.action');
    }
    return Promise.resolve(true);
}
