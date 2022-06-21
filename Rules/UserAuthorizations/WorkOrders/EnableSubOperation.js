/**
* Show/Hide SubOperation Button
* @param {IClientAPI} context
*/
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function EnableSubOperation(context) {
    return !(IsPhaseModelEnabled(context));
}
