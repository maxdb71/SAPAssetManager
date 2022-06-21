/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockSearchNav(context) {
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().StockOnLineSearch=false;
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Stock/StockListViewNav.action');
}
