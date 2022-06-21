import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function GetStockTransportOrderItemsListQuery(context, queryOnly=false) {    
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let stockTransportOrderId = context.binding.StockTransportOrderId;

    let baseQuery = "(StockTransportOrderId eq '" + stockTransportOrderId + "')";
    let expand = 'MaterialPlant_Nav,StockTransportOrderHeader_Nav,STOScheduleLine_Nav';

    if (queryOnly) {
        return '$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=ItemNum';
    }

    queryBuilder = context.dataQueryBuilder();
    libCom.setStateVariable(context,'INVENTORY_CAPTION','STO');
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','StockTransportOrderItems');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'StockTransportOrderItemsListPage');

    if (searchString) { //Supporting order number and material number for searches
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/SupplyingPlant))`);
        filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/Vendor_Nav/Name1))`);
        filters.push(`substringof('${searchString}', tolower(MaterialNum))`);
        filters.push(`substringof('${searchString}', tolower(Material_Nav/Description))`);
    }
    if (filters.length > 0) {
        filter = baseQuery + ' and (' + filters.join(' or ') + ')';
    } else {
        filter = baseQuery;
    }
    queryBuilder.filter(filter);
    queryBuilder.expand(expand);
    queryBuilder.orderBy('ItemNum');
    libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter);

    setCaptionState(context, 'StockTransportOrderItemsListPage'); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;

}
