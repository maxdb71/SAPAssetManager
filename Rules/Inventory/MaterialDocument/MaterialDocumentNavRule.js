import common from '../../Common/Library/CommonLibrary';
export default function MaterialDocumentNavRule(context) {
    let filter = '$filter=MaterialDocNum eq' + "'" + context.getPageProxy().getActionBinding().MaterialDocNum + "'";
    return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsNav.action', 'MaterialDocuments', filter);
}
