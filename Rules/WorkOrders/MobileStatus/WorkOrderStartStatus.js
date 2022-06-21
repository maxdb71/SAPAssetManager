import libWOMobile from './WorkOrderMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function WorkOrderStartStatus(context) {
    context.showActivityIndicator('');
    var isStatusChangeable = libMobile.isHeaderStatusChangeable(context);
    if (isStatusChangeable) {
        return libWOMobile.startWorkOrder(context);
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
}
