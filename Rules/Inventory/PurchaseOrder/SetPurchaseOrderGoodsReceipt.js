import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';

export default function SetPurchaseOrderGoodsReceipt(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'PO'); //PO/STO/RES/IN/OUT/ADHOC
    libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
    return wrapper(context);
}
