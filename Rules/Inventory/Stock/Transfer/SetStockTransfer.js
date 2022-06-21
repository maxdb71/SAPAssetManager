import libCom from '../../../Common/Library/CommonLibrary';

export default function SetStockTransfer(context) {
    libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
    libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
    libCom.setStateVariable(context, 'IMObjectType', 'TRF'); //PO/STO/RES/IN/OUT/ADHOC/MAT/TRF
    libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
}
