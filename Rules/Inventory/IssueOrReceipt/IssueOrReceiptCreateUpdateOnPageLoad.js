import libCom from '../../Common/Library/CommonLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function IssueOrReceiptCreateUpdateOnPageLoad(context) {
    hideCancel(context);
    libCom.saveInitialValues(context);
}
