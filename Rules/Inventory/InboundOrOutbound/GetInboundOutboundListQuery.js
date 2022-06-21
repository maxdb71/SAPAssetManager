import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function GetOutboundListQuery(context, queryOnly=false) {
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let baseQuery = '';
    let expand = 'OutboundDelivery_Nav,ReservationHeader_Nav,PurchaseOrderHeader_Nav,StockTransportOrderHeader_Nav,InboundDelivery_Nav';

    if (queryOnly) {
        return '&$expand=' + expand + '&$orderby=ObjectId';
    }

    queryBuilder = context.dataQueryBuilder();
    libCom.setStateVariable(context,'INVENTORY_CAPTION','IBOB');
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY', baseQuery);
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','MyInventoryObjects');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'InboundOutboundListPage');

    if (searchString) { //Supporting order number and material number for searches
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
    }
    if (filters.length > 0) {
        if (baseQuery) {
            filter = baseQuery + ' and (' + filters.join(' or ') + ')';
        } else {
            filter = '(' + filters.join(' or ') + ')';
        }
    } else {
        filter = baseQuery;
    }
    if (filter) {
        queryBuilder.filter(filter);
    }
    queryBuilder.expand(expand);
    queryBuilder.orderBy('ObjectId');
    libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter);

    setCaptionState(context, 'InboundOutboundListPage'); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;
}
