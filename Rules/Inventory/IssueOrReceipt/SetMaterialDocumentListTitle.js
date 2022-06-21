import GetRelatedMaterialDocsFilter from '../PurchaseOrder/GetRelatedMaterialDocsFilter';
export default function SetMaterialDocumentListTitle(context) {
    return GetRelatedMaterialDocsFilter(context).then(function(queryOption) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', queryOption).then(function(result) {
            context.setCaption(context.localizeText('material_list_title_no_count') +' (' + result.toString() + ')');
            // eslint-disable-next-line no-unused-vars
        }).catch(function(err) {
            //TODO: Log error
            context.setCaption(context.localizeText('material_list_title_no_count'));
        });
    });
}
