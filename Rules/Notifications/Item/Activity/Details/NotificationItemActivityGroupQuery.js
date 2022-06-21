import notification from '../../../NotificationLibrary';

export default function NotificationItemActivityGroupQuery(context) {
    return notification.NotificationItemTaskActivityGroupQuery(context, 'CatTypeActivities');
}
