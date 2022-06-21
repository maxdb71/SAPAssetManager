/**
* Function that executes when reset action is being called with Skip Reset set to true
* @param {IClientAPI} context
*/
export default function ApplicationOnUserSwitch(context) {
    let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
    let storeParameters = provider.getOfflineParameters();
    let headers = storeParameters.getCustomHeaders();
    headers.UserSwitch = true;
    storeParameters.setCustomHeaders(headers);
    context.nativescript.appSettingsModule.setBoolean('didUserSwitchDeltaCompleted', false);
    return context.executeAction('/SAPAssetManager/Actions/DeltaSyncProgressBannerMessage.action');
}
