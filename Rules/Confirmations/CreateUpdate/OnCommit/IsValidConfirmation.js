import GetStartDateTime from './GetStartDateTime';
import GetEndDateTime from './GetEndDateTime';

/**
 * 
 * @param {*} context 
 */
export default function IsValidConfirmation(context) {

    
    let binding = context.getBindingObject();

    if (binding.OrderID.length === 0) {
        return false;
    }

    let now = new Date();
    let start = GetStartDateTime(context);

    // If trying to start in the future, not valid
    if (start > now) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidStart.action').then(function() {
            return Promise.reject(false);
        });
    }


    let endDateTime = GetEndDateTime(context);
    if (endDateTime > now) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidEnd.action').then(function() {
            return false;
        });
    }

    return true;

}
