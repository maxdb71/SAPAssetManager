import common from '../../Common/Library/CommonLibrary';


/**
 * Returns with a formatted requirement date text
 */
export default function GetFormattedRequirementDate(clientAPI) {
    var reservationDoc = clientAPI.binding;
    var documentDate = reservationDoc.RequirementDate;
    if (documentDate) {
        var date = common.dateStringToUTCDatetime(documentDate);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }
    return '';
}
