import libCom from '../Library/CommonLibrary';
import ODataDate from './ODataDate';

/**
 * Return a date offset by the difference between backend and local time
 * @param {Context} context - calling context
 * @param {*} date - (optional) Representation of the Date - default is current date
 * @param {*} time - (optional) Representation of the time
 */
export default function OffsetODataDate(context, date, time) {
    return new ODataDate(date, time, offset(context));
}

/**
 * Retrieve the offset between backend and local time
 * @param {*} context 
 */
function offset(context) {
    let backendOffset = -1 * libCom.getBackendOffsetFromSystemProperty(context);
    let timezoneOffset = (new Date().getTimezoneOffset())/60;
    return backendOffset - timezoneOffset;
}

