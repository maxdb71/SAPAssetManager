import getInboundListQuery from '../Inbound/GetInboundListQuery';
import getCompletedInboundListQuery from '../Inbound/GetCompletedInboundListQuery';

export default function InboundKPIItems(context) {
    let filter = getInboundListQuery(context, true);
    let completedFilter = getCompletedInboundListQuery();
    
    let allDocumentsCount = 0;    
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', filter).then(function(inboundAllDocumentsCount) {
        allDocumentsCount =  inboundAllDocumentsCount;
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', completedFilter).then(function(completedDocumentsCount) {
            return completedDocumentsCount + '/' + allDocumentsCount;
        });
    });
}
