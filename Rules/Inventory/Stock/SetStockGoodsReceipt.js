import libCom from '../../Common/Library/CommonLibrary';

export default function SetStockGoodsReceipt(context) {
    libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
    libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
    libCom.setStateVariable(context, 'IMObjectType', 'MAT'); //PO/STO/RES/IN/OUT/ADHOC/MAT
    libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
    //return wrapper(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
}
