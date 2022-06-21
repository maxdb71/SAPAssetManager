import notification from '../../NotificationLibrary';

export default function NotificationItemTaskGroupQuery(context) {
    return notification.NotificationItemTaskActivityGroupQuery(context, 'CatTypeTasks');
}
