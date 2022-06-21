import resetListPageVariables from '../Common/ResetListPageVariables';

export default function PurchaseOrderItemsListNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderItemsListNav.action');
}
