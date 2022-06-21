import Logger from '../Log/Logger';
import libcomm from '../Common/Library/CommonLibrary';


export default function CheckDefaultDevice(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(() => {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'TOTPDevices', [], '$filter=DefaultDeviceFlag eq true')
        .then(result => {
            if (libcomm.isDefined(result.getItem(0))) {
                libcomm.setStateVariable(context, 'TOTPDefaultReadLink',result.getItem(0)['@odata.readLink']);
                libcomm.setStateVariable(context, 'TOTPDefaultDeviceId', result.getItem(0).DeviceId);
                return result.getItem(0).DefaultDeviceFlag;
            } else {
                return false;
            }
     }).catch(() => {
        return false;
     });
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Online Service Failed' + error); 
        return Promise.reject();    
    });
}
