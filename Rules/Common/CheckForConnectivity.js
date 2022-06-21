/**
* This rule will return true if network connectivity is available, false otherwise.
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
export default function CheckForConnectivity(context) {
    const connectivityModule = context.nativescript.connectivityModule;
    const connectionType = connectivityModule.getConnectionType();
    Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'connectionType = ' + connectionType);
    return (connectionType === connectivityModule.connectionType.none) ? false : true;
}
