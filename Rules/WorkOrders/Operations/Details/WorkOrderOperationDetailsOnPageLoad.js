import WorkOrderCompleted from '../../Details/WorkOrderDetailsOnPageLoad';
import WorkOrderOperationDidHideActionItems from '../WorkOrderOperationDidHideActionItems';

export default function WorkOrderOperationDetailsOnPageLoad(pageClientAPI) {


    // If changed action item visibility based on mobile status
    if (WorkOrderOperationDidHideActionItems(pageClientAPI)) {
        // No need to check parent
        return true;
    }

    // handle the action bar items visiblity based on Work Order status
    return WorkOrderCompleted(pageClientAPI);
}
