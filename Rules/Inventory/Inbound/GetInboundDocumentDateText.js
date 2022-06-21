import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetInboundDocumentDateText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue = binding.ObjectDate;

    if (!libVal.evalIsEmpty(statusValue)) {
        var date = common.dateStringToUTCDatetime(statusValue);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
