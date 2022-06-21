import notification from '../NotificationLibrary';

export default function NotificationItemDamageCodeQuery(context) {
    return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeDefects', 'CodeGroup');
}
