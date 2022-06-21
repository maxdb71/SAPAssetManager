/**
* Adjust the Posting Date value based on the start date change
* @param {IClientAPI} context
*/
import getPostingOverride from '../ConfirmationsGetPostingDateOverride';
import libCom from '../../Common/Library/CommonLibrary';

export default function StartDateOnValueChange(context) {
    if (getPostingOverride(context)) {
        let pageProxy = context.getPageProxy();
        let postingDateControl = libCom.getControlProxy(pageProxy, 'PostingDatePicker');
        let startDate = libCom.getControlProxy(pageProxy, 'StartDatePicker').getValue();
        postingDateControl.setValue(startDate);
    }
}
