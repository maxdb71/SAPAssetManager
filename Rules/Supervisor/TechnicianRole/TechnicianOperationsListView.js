import Logger from '../../Log/Logger';

export default function technicianOperationsListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderOperationsListViewNav called');
    
    let actionBinding = {
        isTechnicianOperationsList: true,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action');
}


