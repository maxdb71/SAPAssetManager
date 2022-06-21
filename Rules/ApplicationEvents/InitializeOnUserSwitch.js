/**
* Initialize action on User Switch
* @param {IClientAPI} context
*/
import downloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';
export default function InitializeOnUserSwitch(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then( ()=> {
        return context.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action').then( () => {
            context.nativescript.appSettingsModule.setBoolean('didUserSwitchDeltaCompleted', true);
            return downloadDefiningRequest(context);
        });
    });
}
