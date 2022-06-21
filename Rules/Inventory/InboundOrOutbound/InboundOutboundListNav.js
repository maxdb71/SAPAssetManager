import resetListPageVariables from '../Common/ResetListPageVariables';

export default function InboundOutboundListNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/InboundOutbound/InboundOutboundListNav.action');
}
