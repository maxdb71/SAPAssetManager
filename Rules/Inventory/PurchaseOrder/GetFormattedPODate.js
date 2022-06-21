import common from '../../Common/Library/CommonLibrary';

/**
 * Returns with a formatted delivery date text
 */
export default function GetFormattedPODate(clientAPI) {
    var doc = clientAPI.binding;
    var documentDate = doc.DocumentDate;
    if (documentDate) {
        var date = common.dateStringToUTCDatetime(documentDate);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }
    return '';
}
