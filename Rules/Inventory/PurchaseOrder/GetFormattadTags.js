export default function GetFormattedTags(clientAPI) {
    var tags = [];
    var purchaseOrder = clientAPI.binding;

    tags.push(clientAPI.localizeText('po_detail_title'));

    var documentStatus = purchaseOrder.DocumentStatus;
    switch (documentStatus) {
        case 'A':
            tags.push(clientAPI.localizeText('open'));
            break;
        case 'B':
            tags.push(clientAPI.localizeText('inbound_document_partial'));
            break;
        case 'C':
            tags.push(clientAPI.localizeText('inbound_document_completed'));
            break;
        case '':
            tags.push(clientAPI.localizeText('open'));
    }
    
    return tags;

    // var poItemsQueryOptions = "$filter=PurchaseOrderId eq '" + purchaseOrder.PurchaseOrderId +"'";
    // return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderItems', [], poItemsQueryOptions).then((poItemsResult) => {

    //     var documentStatus = purchaseOrder.DocumentStatus;
    //     switch (documentStatus) {
    //         case 'A':
    //             tags.push(clientAPI.localizeText('open'));
    //             break;
    //         case 'B':
    //             tags.push(clientAPI.localizeText('inbound_document_partial'));
    //             break;
    //         case 'C':
    //             tags.push(clientAPI.localizeText('inbound_document_completed'));
    //             break;
    //         case '':
    //             tags.push(clientAPI.localizeText('open'));
    //     }
    
    //     if (poItemsResult.length > 0) {
    //         if (poItemsResult.length === 1) {
    //             tags.push(clientAPI.localizeText('number_of_items_1_item'));
    //         } else {
    //             tags.push(clientAPI.localizeText('number_of_items',[poItemsResult.length]));
    //         }
    //     }

    //     return tags;
    // });
}
