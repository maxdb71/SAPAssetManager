import DeleteUnusedOverviewEntities from '../Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import errorLibrary from '../Common/Library/ErrorLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function SyncData(clientAPI) {
    clientAPI.getClientData().Error='';
    return clientAPI.executeAction('/SAPAssetManager/Actions/SyncIntializeMessage.action').then(() => {
    setSyncInProgressState(clientAPI, true);
    if (!libCom.isInitialSync(clientAPI)) {
        return DeleteUnusedOverviewEntities(clientAPI).then( ()=> {
            // MDK's solution to issue https://sapjira.wdf.sap.corp/browse/ICMTANGOAMF10-9879
            errorLibrary.clearError(clientAPI);
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then( ()=> {
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action');
            });
        });
    }
    return clientAPI.getDefinitionValue('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js');
});
}
