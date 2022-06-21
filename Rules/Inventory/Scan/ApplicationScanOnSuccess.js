import libVal from '../../Common/Library/ValidationLibrary';
import comLib from '../../Common/Library/CommonLibrary';
import search from '../Search/InventorySearchNav';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ApplicationScanOnSuccess(context) {
    let data = context.actionResults.BarcodeScanner.data;
    if (!libVal.evalIsEmpty(data)) {
        let filter = `$filter=ObjectId eq '${data}'&$expand=InboundDelivery_Nav,OutboundDelivery_Nav,PurchaseOrderHeader_Nav,ReservationHeader_Nav,StockTransportOrderHeader_Nav`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', [], filter).then(function(results) {
            if (results && results.length > 0) {
                let actionContext = results.getItem(0);
                if (actionContext.PurchaseOrderHeader_Nav) {
                    return comLib.navigateOnRead(context, '/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderDetailsNav.action', actionContext.PurchaseOrderHeader_Nav['@odata.readLink'], '', '/SAPAssetManager/Services/AssetManager.service');
                } else if (actionContext.InboundDelivery_Nav) {
                    return comLib.navigateOnRead(context, '/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action', actionContext.InboundDelivery_Nav['@odata.readLink'], '', '/SAPAssetManager/Services/AssetManager.service');		
                } else if (actionContext.OutboundDelivery_Nav) {
                    return comLib.navigateOnRead(context, '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action', actionContext.OutboundDelivery_Nav['@odata.readLink'], '', '/SAPAssetManager/Services/AssetManager.service');		
                } else if (actionContext.ReservationHeader_Nav) {
                    return comLib.navigateOnRead(context, '/SAPAssetManager/Actions/Inventory/Reservation/ReservationDetailsNav.action', actionContext.ReservationHeader_Nav['@odata.readLink'], '', '/SAPAssetManager/Services/AssetManager.service');		
                }
            }
            return search(context);
        });
    }
}
