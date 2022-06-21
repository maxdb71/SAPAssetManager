export default function GetTags(clientAPI) {
    var status = '';
    var binding = clientAPI.getBindingObject();
    var poItemsQueryOptions = "$filter=PurchaseOrderId eq '" + binding.PurchaseOrderId +"'";
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderItems', [], poItemsQueryOptions).then((poItemsResult) => {
        var isRecieved = true;
        var isPartiallyRecived = false;
        if ( poItemsResult.length > 0) {
            poItemsResult.forEach((item) => {
                if ((item.OrderQuantity - item.ReceivedQuantity) > 0) {
                    isRecieved = false;
                    if (item.ReceivedQuantity > 0) {
                        isPartiallyRecived = true;
                    }
                } else {
                    isPartiallyRecived = true;
                }
            });
            if (isRecieved) {
                status = clientAPI.localizeText('inbound_document_completed');
            } else {
                if (isPartiallyRecived) {
                    status = clientAPI.localizeText('inbound_document_partial');
                } else {
                    status = clientAPI.localizeText('open');
                }
            }
        } else {
            status = clientAPI.localizeText('open');
        }
        return [status];
    });
        
}
