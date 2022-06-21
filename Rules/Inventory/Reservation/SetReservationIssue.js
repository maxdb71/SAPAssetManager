import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';

export default function SetReservationIssue(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'RES');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return wrapper(context);
}
