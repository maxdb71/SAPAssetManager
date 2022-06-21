import reset from './CompleteReset';
export default function ResetAlertAction(clientAPI) {
    return clientAPI.executeAction('/SAPAssetManager/Actions/User/ShowResetWarningDialog.action').then( result => {
        if (result.data === true) {
            reset(clientAPI);
            // workaround fix for BCP-2170187589: SAM crashing on android on reset
            // the workaround is only applicable if the reset is triggered on android live mode and current page is modal
            if (clientAPI.nativescript.platformModule.isAndroid && clientAPI.currentPage.isModal()) {
                clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    clientAPI.executeAction('/SAPAssetManager/Actions/Page/ResetPageNav.action').then(() => {
                        clientAPI.executeAction('/SAPAssetManager/Actions/User/ResetUser.action');
                    });
                });
            } else {
                clientAPI.executeAction('/SAPAssetManager/Actions/User/ResetUser.action');
            }
        }
    });
}
