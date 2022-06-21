import libCommon from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';

export default function WorkOrderListViewSetCaption(context) {
    let queryOption;
    let filterText = libCommon.getStateVariable(context,'WORKORDER_FILTER');

    if (libCommon.isDefined(context.binding) && libCommon.isDefined(context.binding.isHighPriorityList)) {
        queryOption = libWo.getFilterForHighPriorityWorkorders(context);
    } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
        queryOption = libSuper.getFilterForWOPendingReview(context, false);
    } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
        queryOption = libSuper.getFilterForSubmittedWO(context, false);
    }
    if (queryOption) { //Handle MDK filters
        let customFilter = libCommon.getStateVariable(context, 'CustomListFilter');
        if (customFilter) {
            if (filterText !== '$filter=') { //Combine mdk filter with custom filter
                queryOption = queryOption.replace('&$filter=' + customFilter,''); //Remove current custom filter        
                queryOption += '&' + filterText + ' and ' + customFilter; //Inject mdk filter combined with custom filter
            }
        } else {
            if (filterText !== '$filter=') {
                queryOption += '&' + filterText; //Inject mdk filter only
            }
        }
    } else {
        if (filterText !== '$filter=') {
            queryOption = filterText; //Inject mdk filter only
        }
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders',queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('work_order_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('work_order_x_x', params));
    });
}
