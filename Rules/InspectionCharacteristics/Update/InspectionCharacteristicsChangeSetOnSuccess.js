export default function InspectionCharacteristicsChangeSetOnSuccess(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action');
        });
    }
    
    let readlink = `InspectionLots('${context.binding.InspectionLot}')` + '/InspectionChars_Nav';
    let filter = "$filter=CharCategory eq 'X' and Valuation eq ''";

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        readlink = context.binding.InspectionPoint_Nav[0]['@odata.readLink'] + '/InspectionChars_Nav';
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', readlink, filter).then(function(count) {
        if (count === 0) { //get the count for required Characteristics
            let actionBindingContext = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action').then(() => {
                    actionBindingContext.setActionBinding(context.binding.InspectionLot_Nav);
                    return actionBindingContext.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageNav.action');
                });
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action');
        });
    });
}
