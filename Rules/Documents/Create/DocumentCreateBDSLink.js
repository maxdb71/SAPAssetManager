import documentCreateBDSLinkNoClose from './DocumentCreateBDSLinkNoClose';
import DownloadAndSaveMedia from '../DownloadAndSaveMedia';
export default function DocumentCreateBDSLink(controlProxy) {
    return documentCreateBDSLinkNoClose(controlProxy).then(() => {
        return DownloadAndSaveMedia(controlProxy).then(() => {
            controlProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    })
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
