import libDoc from '../Documents/DocumentLibrary';

export default function DocumentAddEditValidation(context) {

    // check attachment count, run the validation rule if there is an attachment
    // return true if there is no new attachment.
    if (libDoc.validationAttachmentCount(context) > 0) {
        return libDoc.createValidationRule(context);
    } else {
        return true;
    }
}
