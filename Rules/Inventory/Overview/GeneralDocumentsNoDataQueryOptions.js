import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function GeneralDocumentsNoDataQueryOptions(context) {

    let queryBuilder = context.dataQueryBuilder();
    let searchString = context.searchString;
    let filter = '';
    let filters = [];

    libCom.setStateVariable(context,'INVENTORY_CAPTION','SEARCH');
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','');
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','MyInventoryObjects');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'InventorySearchPage');

    if (searchString) { //Supporting order number and material number for searches
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().SearchString = searchString;
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(ObjectId))`);
        filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`);
        filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`);
        filters.push(`PurchaseOrderHeader_Nav/PurchaseOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
        filters.push(`substringof('${searchString}', tolower(ReservationHeader_Nav/ReceivingPlant))`);
        filters.push(`ReservationHeader_Nav/ReservationItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
        filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/SupplyingPlant))`);
        filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/Vendor_Nav/Name1))`);
        filters.push(`StockTransportOrderHeader_Nav/StockTransportOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
        filters.push(`InboundDelivery_Nav/Items_Nav/any(wp : substringof('${searchString}', tolower(wp/Material)))`);
        filters.push(`OutboundDelivery_Nav/Items_Nav/any(wp : substringof('${searchString}', tolower(wp/Material)))`);
        filter = '(' + filters.join(' or ') + ')';
        queryBuilder.expand('PurchaseOrderHeader_Nav/Vendor_Nav,InboundDelivery_Nav,OutboundDelivery_Nav,ReservationHeader_Nav,StockTransportOrderHeader_Nav');
    } else {
        filter = "(IMObject eq '00')";
    }
    queryBuilder.filter(filter);
    queryBuilder.orderBy('ObjectId');
    libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter);
    
    setCaptionState(context, 'InventorySearchPage'); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;
}
