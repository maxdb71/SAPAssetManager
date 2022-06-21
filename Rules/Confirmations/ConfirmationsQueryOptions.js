import QueryBuilder from '../Common/Query/QueryBuilder';
import DateBounds from './ConfirmationDateBounds';

export default function ConfirmationsQueryOptions(context) {
    let binding = context.getBindingObject();
    let filter = '';


    let queryBuilder = new QueryBuilder();
    queryBuilder.addExpandStatement('Confirmations');
    queryBuilder.addExtra('orderby=OrderId desc');

    if (binding !== undefined && binding.PostingDate !== undefined) {
        let offsetInMinutes = new Date().getTimezoneOffset();
        let bounds = DateBounds(binding.PostingDate);
        let lowerBound = bounds[0];
        let upperBound = bounds[1];
        
        if (offsetInMinutes !== 0) {
            filter = "Confirmations/any(confirmation:confirmation/StartTimeStamp ge datetime'" + lowerBound + "' and confirmation/StartTimeStamp le datetime'" + upperBound + "')"; 
        } else {
            filter = "Confirmations/any(confirmation:confirmation/StartTimeStamp eq datetime'" + lowerBound + "')";
        }

        queryBuilder.addFilter(filter);


    } else {
        queryBuilder.addFilter('Confirmations/any(confirmation:confirmation/OrderID ne null)');
        queryBuilder.addFilter('ActualDuration ne null');
    }

    return queryBuilder.build();
}
