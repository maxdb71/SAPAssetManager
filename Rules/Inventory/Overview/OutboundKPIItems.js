import getOutboundListQuery from '../Outbound/GetOutboundListQuery';
import getCompletedOutboundListQuery from '../Outbound/GetCompletedOutboundListQuery';

export default function OutboundKPIItems(context) {
    let filter = getOutboundListQuery(context, true);
    let completedFilter = getCompletedOutboundListQuery(context);
    let allDocumentsCount = 0;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', filter).then(function(outboundAllDocumentsCount) {
        allDocumentsCount =  outboundAllDocumentsCount;
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', completedFilter).then(function(outboundCompletedDocumentsCount) {
            return outboundCompletedDocumentsCount + '/' + allDocumentsCount;
        });
    });
}
