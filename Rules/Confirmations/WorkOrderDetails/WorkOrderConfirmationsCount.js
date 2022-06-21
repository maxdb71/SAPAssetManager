import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';


export default function WorkOrderConfirmationsCount(context, isPageProxy = false) {

    if (!isPageProxy) {
        context = context.getPageProxy();
    }

    let binding = context.getBindingObject();


    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`OrderID eq '${binding.OrderId}'`);
    queryBuilder.addFilter('ActualDuration ne null');
    queryBuilder.addExtra('orderby=OrderID desc');

    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.count(context).then(result => {
        return result;
    });    
}
