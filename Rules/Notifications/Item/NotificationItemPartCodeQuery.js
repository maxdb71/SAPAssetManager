import notification from '../NotificationLibrary';

export default function NotificationItemPartCodeQuery(context) {
    return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeObjectParts', 'ObjectPartCodeGroup');
}
