import enableEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import phaseModelEnable from '../../Common/IsPhaseModelEnabled';
export default function OperationPopOverOptionsAreVisible(context) {
    return phaseModelEnable(context) ? false :enableEdit(context);
}
