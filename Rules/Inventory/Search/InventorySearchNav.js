import resetListPageVariables from '../Common/ResetListPageVariables';

export default function InventorySearchNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Search/ApplicationOnSearch.action');
}
