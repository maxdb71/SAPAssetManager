import getCaptionState from '../Common/GetCaptionStateForListPage';

export default function OnReturningInventoryFetch(context) {

    getCaptionState(context, 'InventorySearchPage');

    let documentIds = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DocumentIds;
    if (documentIds && documentIds.length > 0) {
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().DocumentIds=[];
        return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/DocumentsUpdatedLocally.action');
    }    
    
}
