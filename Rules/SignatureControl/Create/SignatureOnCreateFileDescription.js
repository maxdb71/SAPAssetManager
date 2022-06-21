/**
* Description of the Signature File Name
* @param {IClientAPI} context
*/
export default function SignatureOnCreateFileDescription(context) {
    return context.formatDate(new Date()) + ' ' + context.formatTime(new Date().getTime());
}
