
import libVal from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import notificationTotalCount from '../NotificationsTotalCount';
import entitySet from '../NotificationEntitySet';

export default function NotificationListCaption(context) {
    let queryOption = libVal.evalIsEmpty(libCommon.getStateVariable(context, 'NOTIFICATION_FILTER')) ? '' : libCommon.getStateVariable(context, 'NOTIFICATION_FILTER');
    var params = [];
    return notificationTotalCount(context).then((totalCount) => {
        return context.count('/SAPAssetManager/Services/AssetManager.service',entitySet(context.getControls()[0]),queryOption).then(count => {
            params.push(count);
            params.push(totalCount);
            if (count === totalCount) {
                return context.localizeText('notifications_x', [totalCount]);
            }
            return context.localizeText('notifications_x_x', params);
        });
    });
    
}
