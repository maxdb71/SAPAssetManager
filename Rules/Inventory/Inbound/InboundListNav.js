import resetListPageVariables from '../Common/ResetListPageVariables';

export default function InboundListNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Inbound/InboundListNav.action');
}
