import libCom from '../../Common/Library/CommonLibrary';

export default function ReceiptReceiveAllWrapper(context) {

    var messageText = context.localizeText('receive_all_warning');
    var captionText = context.localizeText('warning');

    //Prompt user with receive all warning dialog
    return libCom.showWarningDialog(context, messageText, captionText).then(result => {
        if (result === true) {
            //Figure out binding properties
            libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
            libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
            libCom.removeStateVariable(context, 'ReceiveAllItemId');

            context.binding.TempHeader_DocumentDate = '';
            context.binding.TempHeader_HeaderText = '';
            context.binding.TempHeader_DeliveryNote = '';

            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ReceiptReceiveAllCreateChangeset.action');
        }
        return false;
    }).catch(function() {
        return false; //User terminated out of warning dialog
    });
}
