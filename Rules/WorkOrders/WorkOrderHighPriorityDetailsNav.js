import libCommon from '../Common/Library/CommonLibrary';
import {WorkOrderLibrary as libWo} from './WorkOrderLibrary';

export default function WorkOrderHighPriorityDetailsNav(context) {
    let binding = context.getPageProxy().getActionBinding();

    return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', binding['@odata.readLink'], libWo.getWorkOrderDetailsNavQueryOption());
}
