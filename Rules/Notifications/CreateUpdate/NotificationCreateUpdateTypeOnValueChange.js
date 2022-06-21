import notification from '../NotificationLibrary';
import updateGroupPickers from './UpdateGroupPickers';

export default function NotificationCreateUpdateTypeOnValueChange(context) {
    return notification.NotificationCreateUpdatePrioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
        return notification.setFailureAndDetectionGroupQuery(context);
    });
}
