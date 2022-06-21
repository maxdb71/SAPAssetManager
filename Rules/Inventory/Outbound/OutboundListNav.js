import resetListPageVariables from '../Common/ResetListPageVariables';

export default function OutboundListNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Outbound/OutboundListNav.action');
}
