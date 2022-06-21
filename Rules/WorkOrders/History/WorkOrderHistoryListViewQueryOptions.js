import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderHistoryListViewQueryOptions(context) {
    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');
    let baseQueryStr = '$expand=HistoryLongText,HistoryPriority&$orderby=Priority,OrderId desc';
    if (libVal.evalIsEmpty(referenceType)) {
        return baseQueryStr;
    } else if (referenceType === 'P') {
        return "$filter=ReferenceType eq 'P'&" + baseQueryStr;
    } else {
        return "$filter=ReferenceType eq 'H'&" + baseQueryStr;
    }

}
