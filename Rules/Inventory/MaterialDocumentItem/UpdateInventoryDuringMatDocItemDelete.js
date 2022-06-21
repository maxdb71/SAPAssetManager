import libCom from '../../Common/Library/CommonLibrary';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import reloadMaterialDocumentItem from './ReloadMaterialDocumentItem';

/**
 * 
 * Update the inventory item object quantities after mat doc item delete
 */
 export default function UpdateInventoryDuringMatDocItemDelete(context, item) {
    
    let binding = context.binding;
    let action;
    let readLink;

    if (item) {
        readLink = item['@odata.readLink'];
    }

    return reloadMaterialDocumentItem(context, readLink).then(function(newItem) {
        if (newItem) {
            binding = newItem;
        }
        context.binding.TempLine_OldQuantity = binding.EntryQuantity;
        context.binding.TempLine_EntryQuantity = 0;

        if (binding.PurchaseOrderItem_Nav) {
            libCom.setStateVariable(context, 'IMObjectType', 'PO');
            libCom.setStateVariable(context, 'IMMovementType', 'R');
            context.binding.TempItem_ItemReadLink = binding.PurchaseOrderItem_Nav['@odata.readLink'];
            context.binding.TempItem_OpenQuantity = Number(binding.PurchaseOrderItem_Nav.OpenQuantity);
            context.binding.TempItem_ReceivedQuantity = binding.PurchaseOrderItem_Nav.ReceivedQuantity;
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptPurchaseOrderItemUpdate.action';
        } else if (binding.StockTransportOrderItem_Nav) {
            libCom.setStateVariable(context, 'IMObjectType', 'STO');
            if (allowIssue(binding.StockTransportOrderItem_Nav)) {
                libCom.setStateVariable(context, 'IMMovementType', 'I');
            } else {
                libCom.setStateVariable(context, 'IMMovementType', 'R');
            }
            context.binding.TempItem_ItemReadLink = binding.StockTransportOrderItem_Nav['@odata.readLink'];
            context.binding.TempItem_OrderQuantity = binding.StockTransportOrderItem_Nav.OrderQuantity;
            context.binding.TempItem_ReceivedQuantity = binding.StockTransportOrderItem_Nav.ReceivedQuantity;
            context.binding.TempItem_IssuedQuantity = binding.StockTransportOrderItem_Nav.IssuedQuantity;
            context.binding.TempItem_OpenQuantity = Number(binding.StockTransportOrderItem_Nav.OpenQuantity); //Not used for STO but variable is necessary
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptSTOItemUpdate.action';
        } else if (binding.ReservationItem_Nav) {
            libCom.setStateVariable(context, 'IMObjectType', 'RES');
            libCom.setStateVariable(context, 'IMMovementType', 'I');
            context.binding.TempItem_ItemReadLink = binding.ReservationItem_Nav['@odata.readLink'];
            context.binding.TempItem_OpenQuantity = Number(binding.ReservationItem_Nav.RequirementQuantity) - Number(binding.ReservationItem_Nav.WithdrawalQuantity);
            context.binding.TempItem_ReceivedQuantity = binding.ReservationItem_Nav.WithdrawalQuantity;
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptReservationItemUpdate.action';
        }

        if (action) {
            return context.executeAction(action).then(() => {
                return FinishDelete(context, binding);
            });
        }
        return FinishDelete(context, binding); //Not a type that requires update
    });
}

/**
 * 
 * Remove document header if no more items and close screen if necessary
 */
export function FinishDelete(context, binding) {   

    if (!libCom.getStateVariable(context, 'TempInventoryMaterialDocumentDelete')) {
        let filter = "$filter=MaterialDocNumber eq '" + binding.MaterialDocNumber + "' and MaterialDocYear eq '" + binding.MaterialDocYear + "'";
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', filter).then(function(count) {
            if (count === 0) { //No more items, so delete the header also
                binding.TempHeader_MatDocReadLink = "MaterialDocuments(MaterialDocNumber='" + binding.MaterialDocNumber + "',MaterialDocYear='" + binding.MaterialDocYear + "')";
                return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDeleteDuringItemDelete.action').then(() => {
                    let pageName = libCom.getPageName(context.evaluateTargetPathForAPI('#Page:-Previous'));
                    if (pageName === 'MaterialDocumentItemList') { //Close item edit, mat doc item list, mat doc details
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                            });
                        });
                    } //Close item edit, mat doc details
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                    });
                });
            } //Close item edit
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
        });
    }
    return Promise.resolve(true);
}
