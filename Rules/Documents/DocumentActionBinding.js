export default function DocumentActionBinding(pageProxy) {
    let actionBinding = pageProxy.getActionBinding();
    if (actionBinding) {
        return actionBinding;
    }
    if (!actionBinding || !actionBinding.Document ) {
        actionBinding = pageProxy.getPendingDownload('DocumentsListView') ;
    }
    if (!actionBinding || !actionBinding.Document ) {
        actionBinding = pageProxy.getPendingDownload('EquipmentDetailsPage');
    }
    if (!actionBinding || !actionBinding.Document ) {
        actionBinding = pageProxy.getPendingDownload('FunctionalLocationDetails');
    }
    return actionBinding;
}
