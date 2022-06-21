/**
* Show/Hide Notification Add popover if both edit and Work Order create is disabled based on User Authorization
* @param {IClientAPI} context
*/
import enableNotificaitonEdit from './EnableNotificationEdit';
import enableWorkOrderCreate from '../WorkOrders/EnableWorkOrderCreate';

export default function EnableNotificationCreateEdit(context) {
    return (enableNotificaitonEdit(context) || enableWorkOrderCreate(context) );
}
