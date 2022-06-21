import libVal from '../../Common/Library/ValidationLibrary';
import signatureDetails  from './SignatureObjectDetails';
/**
* To determine the watermark text
* @param {IClientAPI} context
*/
export default function SignatureWatermarkText(context) {
    context._context.binding = libVal.evalIsEmpty(context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject) ? context.evaluateTargetPathForAPI('#Page:-Previous').binding : context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject;
    let watermarkText = [signatureDetails(context)];
    watermarkText.push('User:' + context.evaluateTargetPath('#Application/#ClientData/#Property:UserId'));
    return (context.nativescript.platformModule.isAndroid) ? watermarkText.join('\n') : watermarkText.join(',');
}
