import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderDetailsAddPopover(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action');
}
