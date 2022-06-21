/**
* Check if there is a need to send User Info
* @param {IClientAPI} context
*/

export default function PushNotificationUserInfoUpdate(context) {
    if (!context.nativescript.appSettingsModule.getBoolean('didSetUserGeneralInfos', false)) {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationUserInfoUpdate.action');
    }
}
