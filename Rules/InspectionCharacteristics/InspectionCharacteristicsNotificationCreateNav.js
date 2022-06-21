
import common from '../../Rules/Common/Library/CommonLibrary';

export default function InspectionCharacteristicsNotificationCreateNav(context) {
    common.setOnCreateUpdateFlag(context, 'CREATE');
    // Add HeaderFunctionLocation and HeaderEquipment to new binding
    // Forces Notification Create page to default pickers
    let newBinding = context.binding;
    newBinding.HeaderFunctionLocation = context.binding.InspectionLot_Nav.FunctionalLocation;
    newBinding.HeaderEquipment = context.binding.InspectionLot_Nav.Equipment;
    context.getPageProxy().setActionBinding(newBinding);
    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsNotificationCreateNav.action');
}
