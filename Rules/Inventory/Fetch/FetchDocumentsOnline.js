import Logger from '../../Log/Logger';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FetchDocumentsOnline(context) {
    context.updateProgressBanner(context.localizeText('initialize_online_service'));
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
        context.updateProgressBanner(context.localizeText('open_online_service'));
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
            context.updateProgressBanner(context.localizeText('fetch_documents'));
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents = [];
            return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocumentsOnline.action');
        }).catch(function(err) {
            Logger.error(`Failed to open Online OData Service: ${err}`);
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    }).catch(function(err) {
        Logger.error(`Failed to initialize Online OData Service: ${err}`);
        return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
    });
}
