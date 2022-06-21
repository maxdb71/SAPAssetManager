export default function TOTPPartialUploadAfterCreate(context) {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPerfsTOTPDevicesPartialUploads.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/TOTPDeviceUpdateSuccess.action');
        }).catch(() => {
            return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
        });
}
