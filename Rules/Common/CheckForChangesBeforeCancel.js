import libCom from './Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) {
    libCom.clearFromClientData(context, 'BOMPartAdd', false);
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        libCom.setOnCreateUpdateFlag(context, '');
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
