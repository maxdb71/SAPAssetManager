import resetListPageVariables from '../Common/ResetListPageVariables';

export default function StockTransportOrderItemsListNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderItemsListNav.action');
}
