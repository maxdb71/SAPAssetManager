import notification from '../NotificationLibrary';

export default function NotificationActivityCodeQuery(context) {
    return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeActivities', 'ActivityCodeGroup');
}
