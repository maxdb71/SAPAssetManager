export default function TOTPPartialUploadAfterDelete(context) {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPerfsTOTPDevicesPartialUploads.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
        }).catch(() => {
            return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
        });
}
