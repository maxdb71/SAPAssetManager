import libCom from '../../Common/Library/CommonLibrary';

export default function OperationsListViewNav(context) {

    let actionBinding = {
        isOperationsList: true,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    libCom.setStateVariable(context,'FromOperationsList', true);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action');
}
