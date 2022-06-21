import libCom from '../../../Rules/Common/Library/CommonLibrary';
import ODataDate from '../../../Rules/Common/Date/ODataDate';

//Enel customization

export default function ConfirmationStartTimeDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, true);
    return context.formatTime(offsetOdataDate.date());
}

function ConfirmationDateFromOData(context, confirmation, isStart) {

    let date, time;
    if (isStart) {
        date = confirmation.StartDate;
        time = confirmation.StartTime;
    } else {
        date = confirmation.FinishDate;
        time = confirmation.FinishTime;
    }
    return new OffsetODataDate(context, date, time);
}

/**
 * Return a date offset by the difference between backend and local time
 * @param {Context} context - calling context
 * @param {*} date - (optional) Representation of the Date - default is current date
 * @param {*} time - (optional) Representation of the time
 */
function OffsetODataDate(context, date, time) {
    return new ODataDate(date, time, 0);
}

/**
 * Retrieve the offset between backend and local time
 * @param {*} context 
 */
function offset(context) {
    let backendOffset = -1 * libCom.getBackendOffsetFromSystemProperty(context);
    let timezoneOffset = (new Date().getTimezoneOffset()) / 60;
    return backendOffset - timezoneOffset;
}
