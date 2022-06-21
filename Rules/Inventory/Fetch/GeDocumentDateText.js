import common from '../../Common/Library/CommonLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GeDocumentDateText(clientAPI) {
    var binding = clientAPI.getBindingObject();

    if (binding.ObjectDate) {
        var date = common.dateStringToUTCDatetime(binding.ObjectDate);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
