import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function GetPurchaseOrderItemsListQuery(context, queryOnly=false) {    
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let purchaseOrderId = context.binding.PurchaseOrderId;

    let baseQuery = "(PurchaseOrderId eq '" + purchaseOrderId + "')";
    let expand = 'MaterialPlant_Nav,ScheduleLine_Nav';

    if (queryOnly) {
        return '$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=ItemNum';
    }

    queryBuilder = context.dataQueryBuilder();
    libCom.setStateVariable(context,'INVENTORY_CAPTION','PO');
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','PurchaseOrderItems');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'PurchaseOrderItemsListPage');

    if (searchString) { //Supporting order number and material number for searches
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`);
        filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`);
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

    setCaptionState(context, 'PurchaseOrderItemsListPage'); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;

}
