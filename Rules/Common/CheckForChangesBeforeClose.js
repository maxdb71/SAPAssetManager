import libCom from './Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeClose(context) { 
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmClosePage.action');
    } else {
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
}
