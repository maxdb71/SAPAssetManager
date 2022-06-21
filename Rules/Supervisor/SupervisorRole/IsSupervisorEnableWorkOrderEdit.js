/**
* Show/Hide Work Order edit button based on User Authorization
* @param {IClientAPI} context
*/
import enableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import isSupervisorSectionVisibleForOperations from './IsSupervisorSectionVisibleForOperations';
import common  from '../../Common/Library/CommonLibrary';

export default function IsSupervisorEnableWorkOrderEdit(context) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible || common.getAppParam(context, 'EAM_PHASE_MODEL', 'Enable') === 'Y') {
            return false;
        }
        return enableWorkOrderEdit(context);
    });
}
