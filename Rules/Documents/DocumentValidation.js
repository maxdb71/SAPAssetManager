/**
* Validate the attachments by checking the Description and Attachment Control.
* By default the rule takes the Description and Attachment from the control but
* you can also pass it through rule.
* @param {Icontext} context
* @param {FormCell.Note} descriptionCtrl
* @param {FormCell.Attachment} attachmentCtrl
*/
import ComLib from '../Common/Library/CommonLibrary';
import DocLib from './DocumentLibrary';
import Logger from '../Log/Logger';
import documentCreate from './Create/DocumentCreateBDS';
import libVal from '../Common/Library/ValidationLibrary';
export default function DocumentValidation(context, descriptionCtrl='', attachmentCtrl='') {
    let valPromises = [];
    let container = context.getControl('FormCellContainer');
    if (libVal.evalIsEmpty(descriptionCtrl)) {
        descriptionCtrl = context.getControl('FormCellContainer').getControl('AttachmentDescription');
    }
    if (libVal.evalIsEmpty(attachmentCtrl)) {
        attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment');
    }
    let charLimitInt = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentDescriptionMaximumLength.global').getValue();

    //Clear previous inline errors if any
    ComLib.setInlineControlErrorVisibility(descriptionCtrl, false);
    container.redraw();
    // get all of the validation promises
    valPromises.push(DocLib.validationCharLimit(context, descriptionCtrl, charLimitInt));
    valPromises.push(DocLib.validationMinimumCount(context, attachmentCtrl, descriptionCtrl, 1));
    // check all validation promises;
    // if all resolved -> return true
    // if at least 1 rejected -> return false
    return Promise.all(valPromises).then(() => {
        return documentCreate(context, attachmentCtrl.getClientData().AddedAttachments);

    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
        container.redraw();
        return Promise.resolve(false);
    });
}
