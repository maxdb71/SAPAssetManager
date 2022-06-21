{
    "MainPage": "/SAPAssetManager/Pages/SideMenuDrawer.page",
    "_Name": "SAPAssetManager",
    "OnUserSwitch": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnUserSwitch.js",
    "OnWillUpdate": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnWillUpdate.js",
    "OnDidUpdate": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnDidUpdate.js",
    "Version": "1.9",
    "OnLaunch": [
	"/SAPAssetManager/Rules/Log/InitializeLogger.js",
        "/SAPAssetManager/Rules/Common/PerformAppUpdateCheck.js",
        "/SAPAssetManager/Rules/Sync/InitializeSyncState.js"
    ],
    "Styles": "/SAPAssetManager/Styles/Styles.less",
    "Localization": "/SAPAssetManager/i18n/i18n.properties",
    "OnReceiveForegroundNotification" : "/SAPAssetManager/Rules/PushNotifications/PushNotificationsForegroundNotificationEventHandler.js",
    "OnReceiveFetchCompletion" : "/SAPAssetManager/Rules/PushNotifications/PushNotificationsContentAvailableEventHandler.js",
    "OnReceiveNotificationResponse" : "/SAPAssetManager/Rules/PushNotifications/PushNotificationsReceiveNotificationResponseEventHandler.js"
}
