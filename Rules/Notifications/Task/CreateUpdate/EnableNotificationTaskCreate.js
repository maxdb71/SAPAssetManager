import IsPhaseModelEnabled from '../../../Common/IsPhaseModelEnabled';
import EnableNotificationCreate from '../../../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsNotificationMinor from '../../MobileStatus/IsNotificationMinor';
import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';

export default function EnableNotificationTaskCreate(context) {
    if (EnableNotificationCreate(context)) {
        if (IsPhaseModelEnabled(context) && IsNotificationMinor(context, MobileStatusLibrary.getMobileStatus(context.binding, context))) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
