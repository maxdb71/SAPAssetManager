import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockFilterIsVisible(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData();
    if (!libVal.evalIsEmpty(clientData.StockOnLineSearch) && clientData.StockOnLineSearch) {
        return false;
    }
    return true;
}
