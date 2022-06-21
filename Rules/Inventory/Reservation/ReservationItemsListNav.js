import resetListPageVariables from '../Common/ResetListPageVariables';

export default function ReservationItemsListNav(context) {
    resetListPageVariables(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Reservation/ReservationItemsListNav.action');
}
