import QueryBuilder from '../../Common/Query/QueryBuilder';
import DateBounds from '../ConfirmationDateBounds';


export default function WorkOrderConfirmationsQueryOptions(context) {

    let binding = context.getBindingObject();

    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`OrderID eq '${binding.OrderId}'`);
    queryBuilder.addAllExpandStatements(['WorkOrderHeader','AcctIndicator','Variance']);
    queryBuilder.addAllExpandStatements(['WorkOrderOperation','WorkOrderSubOperation']);
    queryBuilder.addAllExpandStatements(['WorkOrderHeader/OrderMobileStatus_Nav','WorkOrderOperation/OperationMobileStatus_Nav','WorkOrderSubOperation/SubOpMobileStatus_Nav']);

    let date = context.evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
    if (date === undefined) {
        queryBuilder.addFilter('ActualDuration ne null');
    } else {
        let filter = '';
        let offsetInMinutes = new Date().getTimezoneOffset();
        let bounds = DateBounds(date);
        let lowerBound = bounds[0];
        let upperBound = bounds[1];

        if (offsetInMinutes !== 0) {
            filter = "StartTimeStamp ge datetime'" + lowerBound + "' and StartTimeStamp le datetime'" + upperBound + "'"; 
        } else {
            filter = "StartTimeStamp eq datetime'" + lowerBound+ "'";
        }
        
        queryBuilder.addFilter(filter);
    }

    queryBuilder.addExtra('orderby=StartTimeStamp');

    return queryBuilder.build();
}
