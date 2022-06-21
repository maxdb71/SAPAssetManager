import notification from '../NotificationLibrary';

export default function NotificationTaskGroupQuery(context) {
    return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeTasks');
}
