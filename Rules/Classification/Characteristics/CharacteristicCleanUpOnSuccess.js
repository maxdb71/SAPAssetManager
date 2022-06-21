/** Clear the state variable when user hit Done and if Success */
import cleanClientData from './CharacteristicCleanUp';
export default function CharacteristicCleanUpOnSuccess(pageProxy) {
    pageProxy.evaluateTargetPath('#Page:-Previous/#ClientData').didUpdateEntity = true;
    cleanClientData(pageProxy);
    return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
}
