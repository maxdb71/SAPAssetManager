export default function SetMaterialDocumentItemListTitle(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', `$filter=MaterialDocNumber eq '${context.binding.MaterialDocNumber}'`).then(function(result) {
        context.setCaption(context.localizeText('material_document_items_title') +' (' + result.toString() + ')');
        // eslint-disable-next-line no-unused-vars
    }).catch(function(err) {
        //TODO: Log error
        context.setCaption(context.localizeText('material_document_items_title'));
    });
}
