import common from '../../Common/Library/CommonLibrary';
export default function MaterialDocumentCreatedOn(context) {
    var date = common.dateStringToUTCDatetime(context.getBindingObject().PostingDate);
    var dateText = common.getFormattedDate(date, context);
    return context.localizeText('created_on',[dateText]);
}
