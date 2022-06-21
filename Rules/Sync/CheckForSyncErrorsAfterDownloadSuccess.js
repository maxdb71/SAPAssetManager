import libCom from '../Common/Library/CommonLibrary';
import {DeltaSyncInit} from '../Common/InitializeGlobalStates';
import CreateDefaultOverviewRowEntities from '../Confirmations/Init/CreateDefaultOverviewRowEntities';
import setSyncInProgressState from './SetSyncInProgressState';
import getPendingPushState from '../PushNotifications/GetPushNotificationsPendingState';
import setPendingPushState from '../PushNotifications/SetPushNotificationsPendingState';
import libVal from '../Common/Library/ValidationLibrary';
import downloadPush from '../PushNotifications/PushNotificationsDownload';

export default function CheckForSyncErrorsAfterDownloadSuccess(context) {
    setSyncInProgressState(context, false);
    // If there are pending Pushes, execute those
    if (getPendingPushState(context)) {
        // If there are pending pushes then we set the "PendingPush" state to false
        // and set the "SyncInProgress" state to true again and download the Push
        setPendingPushState(context, false);
        setSyncInProgressState(context, true);
        downloadPush(context, libCom.getStateVariable(context, 'ObjectType'));
    }
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '').then(result => {
            if (result > 0) {
                return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action').then(function() {
                    return Promise.reject(false);
                });
            } else {
                return DeltaSyncInit(context).then(() => {
                    return CreateDefaultOverviewRowEntities(context).then(() => {
                        let didUserSwitchCompleted = context.nativescript.appSettingsModule.getBoolean('didUserSwitchDeltaCompleted');
                        if (libVal.evalIsEmpty(didUserSwitchCompleted) || didUserSwitchCompleted) { //stop setting the flag to true until user swtich delta is completed
                            context.nativescript.appSettingsModule.setBoolean('didSetUserGeneralInfos', true); 
                        }
                        return context.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
                    });
                });
            }
    });
}
