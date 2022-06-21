import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';
import ConfirmationsIsEnabled from '../ConfirmationsIsEnabled';


export default function DeleteUnusedOverviewEntities(context) {

    //make sure the current context is the PageProxy
    if (typeof context.getPageProxy === 'function') {
        context = context.getPageProxy();
    }

    if (!ConfirmationsIsEnabled(context)) {
        // Exit early
        return Promise.resolve(true);
    }
    
    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter('sap.islocal()');

    let fetchRequest = new FetchRequest('ConfirmationOverviewRows', queryBuilder.build());

    return fetchRequest.execute(context).then(results => {
        if (results === undefined) {
            return Promise.resolve(true);
        }
        return executeDeleteChain(context, results);
    });
}

function executeDeleteChain(context, entities) {
    if (entities.length === 0) {
        return Promise.resolve(true);
    }
    return deleteOverview(context, entities.pop()).then(() => {
        return executeDeleteChain(context, entities);
    });
}

function deleteOverview(context, overview) {
    context.getClientData().ConfirmationOverviewRowReadlink = overview['@odata.readLink'];
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationOverviewRowDelete.action');
}
