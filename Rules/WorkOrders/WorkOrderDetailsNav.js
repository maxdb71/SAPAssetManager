import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrderDetailsNav(context) {
    let actionBinding;
    let previousPageProxy;
    let pageProxy;

    try {

        if (typeof context.getPageProxy === 'function') {
            actionBinding = context.getPageProxy().getActionBinding();
            previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context.getPageProxy();
        } else {
            actionBinding = context.getActionBinding();
            previousPageProxy = context.evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context;
        }

    } catch (err) {
        actionBinding = context.getPageProxy().getActionBinding();
        pageProxy = context.getPageProxy();
        return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], libWo.getWorkOrderDetailsNavQueryOption()).then(function(result) {
            pageProxy.setActionBinding(result.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
        });
    }

   

    if (libCom.getPageName(previousPageProxy) === 'PartDetailsPage') {
        let partsPreviousPage = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        if (libCom.getPageName(partsPreviousPage) === 'PartsListViewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            });
        }
    }

    if (libCom.getPageName(previousPageProxy) === 'WorkOrderDetailsPage' && previousPageProxy.getBindingObject().OrderId === actionBinding.OrderId) { //if the previous page was the parent workorder then, navigate back
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], libWo.getWorkOrderDetailsNavQueryOption()).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
    });
}
