import signatureCreateBDSLinkNoClose from '../Create/SignatureCreateBDSLinkNoClose';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';
export default function SignatureCreateBDSLink(controlProxy) {
    return signatureCreateBDSLinkNoClose(controlProxy).then(() => {
        return DownloadAndSaveMedia(controlProxy).then(() => {
            return controlProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        });
    })
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
