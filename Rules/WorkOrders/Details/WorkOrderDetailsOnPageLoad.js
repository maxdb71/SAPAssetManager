import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
export default function WorkOrderDetailsOnPageLoad(context) {
    // Hide the action bar based if order is complete and set the flag indicating if action items are visible or not.
    return libWOStatus.isOrderComplete(context).then(status => {
        if (status) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
            return true;
        }
        return false;
    });
}
