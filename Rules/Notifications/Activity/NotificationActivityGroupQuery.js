import notification from '../NotificationLibrary';

export default function NotificationActivityGroupQuery(context) {
    return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeActivities');
}
