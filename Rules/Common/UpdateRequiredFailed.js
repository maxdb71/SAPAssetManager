import libCommon from './Library/CommonLibrary';

export default function UpdateRequiredFailed(pageProxy) {
    
    //first remove all previous validation - this is only temporary, once we get onValueChange() function for
    //Note control, we can remove the following - TODO
    let allControls = pageProxy.getControl('FormCellContainer').getControls();
    for (let item of allControls) {
        libCommon.setInlineControlErrorVisibility(item, false);
    }

    //get the missing fields
    let missingRequiredFields = pageProxy.getMissingRequiredControls();
    let message = pageProxy.localizeText('field_is_required');

    //set the inline error
    for (let control of missingRequiredFields) {
        libCommon.setInlineControlError(pageProxy, control, message);
    }

    //show inline error
    pageProxy.getControl('FormCellContainer').redraw();  
}
