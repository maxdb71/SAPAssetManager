import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import IsSupervisorEnableWorkOrderCreate from '../../Supervisor/SupervisorRole/IsSupervisorEnableWorkOrderCreate';

export default function IsWorkOrderAllowedToCreateUpdate(context) {
    return !IsPhaseModelEnabled(context) && IsSupervisorEnableWorkOrderCreate(context);
}
