import common from '../../Common/Library/CommonLibrary';

/**
 * Gets the document date for each inventory header object type
 */
 
export default function GetDocumentDateForInventoryHeader(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue = binding.MyInventoryObject_Nav.ObjectDate;

    if (statusValue) {
        var date = common.dateStringToUTCDatetime(statusValue);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
