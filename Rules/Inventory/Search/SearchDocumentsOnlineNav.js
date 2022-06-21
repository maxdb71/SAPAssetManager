export default function SearchDocumentsOnlineNav(context) {
    context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocuments.action');
}
