import notification from '../NotificationLibrary';

export default function NotificationTaskGroupQuery(context) {
    return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeTasks', 'TaskCodeGroup');
}
