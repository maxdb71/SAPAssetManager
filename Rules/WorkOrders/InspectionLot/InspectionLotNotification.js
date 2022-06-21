import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotNotification(context) {
    var binding = context.binding.NotifItems_Nav;
    if (libVal.evalIsEmpty(binding.NotificationNumber)) {
        return '-';
    } else {
        return binding.NotificationNumber;
    }
}
