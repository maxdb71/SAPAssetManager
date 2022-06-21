import libCommon from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';

export default function WorkOrderListViewCaption(context) {

    let queryOption;
    if (libCommon.isDefined(context.binding) && libCommon.isDefined(context.binding.isHighPriorityList)) {
        queryOption = libWo.getFilterForHighPriorityWorkorders(context);
    } else if (libCommon.isDefined(context.binding) && (libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
        queryOption = libSuper.getFilterForWOPendingReview(context, false);
    } else if (libCommon.isDefined(context.binding) && (libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
        queryOption = libSuper.getFilterForSubmittedWO(context, false);
    } else {
        queryOption = libCommon.getStateVariable(context,'WORKORDER_FILTER');
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
