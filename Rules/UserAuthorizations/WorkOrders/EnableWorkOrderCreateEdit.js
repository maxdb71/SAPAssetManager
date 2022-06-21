/**
* Show/Hide WorkOrder Add popover based on User Authorization and completion status
* @param {IClientAPI} context
*/
import enableWorkOrderEdit from './EnableWorkOrderEdit';

export default function EnableWorkOrderCreateEdit(context) {
    return enableWorkOrderEdit(context);
}
