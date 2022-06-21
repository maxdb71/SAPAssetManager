import notif from './NotificationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function ResetNotificationFlagsContinue(context) {
    libCom.setOnCreateUpdateFlag(context, '');
    if (notif.getAddFromOperationFlag(context)) {
        notif.setAddFromOperationFlag(context, false);
    }

    if (notif.getAddFromSuboperationFlag(context)) {
        notif.setAddFromSuboperationFlag(context, false);
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'); //Continue pending actions
}
