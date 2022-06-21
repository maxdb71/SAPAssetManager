
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SearchStockOnline(context) {
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().StockOnLineSearch=true;
    let StockOnLine = Object();
    StockOnLine.Plant = context.evaluateTargetPath('#Control:PlantListPicker').getValue();
    StockOnLine.StorageLocation = context.evaluateTargetPath('#Control:StorageLocationListPicker').getValue();
     StockOnLine.MaterialID = context.evaluateTargetPath('#Control:MatrialId').getValue();
    StockOnLine.MaterialDescription = context.evaluateTargetPath('#Control:MatrialDescription').getValue();
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().StockOnLine=StockOnLine;
    context.setActionBarItemVisible(0, false);
    context.setActionBarItemVisible(1, true);
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
            let stocksListOfflineSection = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getControls()[0].getSections()[0];
            let stocksListOnlineSection = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getControls()[0].getSections()[1];
            return stocksListOfflineSection.setVisible(false).then(function() {
                return stocksListOnlineSection.setVisible(true).then(function() {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            });
        }).catch(() => {
            // Could not open online service
            //Logger.error(`Failed to open Online OData Service: ${err}`);
            return Promise.resolve(true);
        });
    }).catch(() =>  {
        // Could not init online service
        //Logger.error(`Failed to initialize Online OData Service: ${err}`);
        return Promise.resolve(true);
    });
}
