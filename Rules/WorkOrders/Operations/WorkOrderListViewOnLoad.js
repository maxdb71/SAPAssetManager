import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import setCaption from './WorkOrderOperationListViewSetCaption';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderListViewOnLoad(clientAPI) {
    libCommon.setStateVariable(clientAPI, 'OPERATIONS_FILTER', '');
    setCaption(clientAPI);
    return libWOStatus.isOrderComplete(clientAPI).then(status => {
        if (status) {
            clientAPI.setActionBarItemVisible(0, false);
        }
    });
}
