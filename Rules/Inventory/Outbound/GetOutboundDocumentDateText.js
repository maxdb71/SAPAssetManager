import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Calculates the text for the status property at the Outbound List screen
 */
 
export default function GetOutboundDocumentDateText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var documentDate = binding.ObjectDate;
   
    if (!libVal.evalIsEmpty(documentDate)) {
        var date = common.dateStringToUTCDatetime(documentDate);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }
        
    return '';
}
