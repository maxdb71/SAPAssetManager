import notification from '../NotificationLibrary';

export default function NotificationItemDamageGroupQuery(context) {
    return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeDefects');
}
