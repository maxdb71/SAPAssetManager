import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function GetReservationItemsListQuery(context, queryOnly=false) {    
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let reservationNum = context.binding.ReservationNum;

    let baseQuery = "(ReservationNum eq '" + reservationNum + "')";
    let expand = 'ReservationHeader_Nav,MaterialPlant_Nav';

    if (queryOnly) {
        return '$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=ItemNum';
    }

    queryBuilder = context.dataQueryBuilder();
    libCom.setStateVariable(context,'INVENTORY_CAPTION','RES');
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','ReservationItems');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'ReservationItemsListPage');

    if (searchString) { //Supporting plant and material number/description
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(ReservationHeader_Nav/ReceivingPlant))`);
        filters.push(`substringof('${searchString}', tolower(MaterialNum))`);
        filters.push(`substringof('${searchString}', tolower(MaterialPlant_Nav/Material/Description))`);
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

    setCaptionState(context, 'ReservationItemsListPage'); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;

}
