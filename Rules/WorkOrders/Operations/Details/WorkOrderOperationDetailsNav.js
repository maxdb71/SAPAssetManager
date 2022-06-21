export default function WorkOrderOperationDetailsNav(sectionedTableProxy) {
    ///Needs to be redone
    // let actionBinding = sectionedTableProxy.getPageProxy().getActionBinding();
    // let previousPageProxy = sectionedTableProxy.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');

    // if (libCommon.getPageName(previousPageProxy) === 'WorkOrderOperationDetailsPage' && previousPageProxy.getBindingObject().OperationNo === actionBinding.OperationNo) { //if the previous page was the same operation that the user is clicking on now then, navigate back
    //     return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    // }

    return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
}
