/**
* Describe this function...
* @param {IClientAPI} context
*/

export default function CreateDigitalSignatureSuccess(context) {
    // Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'CreateDigitalSignature result = ' + JSON.stringify(context.actionResults.result));
    // save object id and sign key in user preferences
    context.getClientData().ObjectID = context.binding['@odata.id'];
    return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPrefsSaveSignatureID.action');
}
