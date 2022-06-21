import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function NotificationDetailsSectionVisible(context) {
    return !IsPhaseModelEnabled(context);
}
