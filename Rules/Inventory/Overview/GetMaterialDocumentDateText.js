import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Calculates the text for the status property at the Outbound List screen
 */
 
export default function GetMaterialDocumentDateText(context) {
   
    if (!libVal.evalIsEmpty(context.binding.DocumentDate)) {
        var date = common.dateStringToUTCDatetime(context.binding.DocumentDate);
        var dateText = common.getFormattedDate(date, context);
        return dateText;
    }
        
    return '';
}
