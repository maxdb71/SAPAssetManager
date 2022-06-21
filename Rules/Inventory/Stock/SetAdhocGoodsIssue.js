import libCom from '../../Common/Library/CommonLibrary';

export default function SetAdhocGoodsIssue(context) {
    libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
    libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
    libCom.setStateVariable(context, 'IMObjectType', 'ADHOC'); //PO/STO/RES/IN/OUT/ADHOC/MAT
    libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
    //return wrapper(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
}
