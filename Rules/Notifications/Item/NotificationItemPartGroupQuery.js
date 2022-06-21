import notification from '../NotificationLibrary';

export default function NotificationItemPartGroupQuery(context) {
    return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeObjectParts');
}
