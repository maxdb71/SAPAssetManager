/**
* Open the privacy policy
* @param {IClientAPI} context
*/
export default function PrivacyPolicyLink(context) {
    return context.nativescript.utilsModule.openUrl('https://help.sap.com/doc/7324f40453334acba177a71d85e25cbd/Latest/en-US/Privacy%20Policy.html');
}
