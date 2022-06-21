import comLib from '../../Common/Library/CommonLibrary';

/**
 * Navigate to the proper object from the Outbound list
 */
export default function OutboundNavigateToObject(clientAPI) {
    let pageProxy = clientAPI.getPageProxy();
    let actionContext = pageProxy.getActionBinding();
    
    if (actionContext.OutboundDelivery_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action', actionContext.OutboundDelivery_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');		
    } else if (actionContext.ReservationHeader_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/Reservation/ReservationDetailsNav.action', actionContext.ReservationHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');		
    } else if (actionContext.StockTransportOrderHeader_Nav) {
        return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderDetailsNav.action', actionContext.StockTransportOrderHeader_Nav['@odata.readLink'], '$expand=MyInventoryObject_Nav');             
    }
	
}
