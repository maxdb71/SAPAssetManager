/**
* Adjust the Start Time value based on the Duration 
* @param {IClientAPI} formCellControlProxy
*/
import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';
import getPostingOverride from '../ConfirmationsGetPostingDateOverride';

export default function DurationOnValueChange(formCellControlProxy) {

    if (formCellControlProxy.getPageProxy().binding.IsOnCreate) {
        let duration = formCellControlProxy.getValue();
        let pageProxy = formCellControlProxy.getPageProxy();
        let binding = pageProxy.binding;

        let currentDate = new Date();
        let startDateTime = new ODataDate(binding.PostingDate); //This is done so that the Posting Date is preserved when the confirmation is being added for a different date than today

        startDateTime.date().setHours(currentDate.getHours());
        startDateTime.date().setMinutes(currentDate.getMinutes());

        startDateTime.date().setMinutes(currentDate.getMinutes() - duration);

        let startDateControl = libCom.getControlProxy(pageProxy, 'StartDatePicker');
        startDateControl.setValue(startDateTime.date());

        if (getPostingOverride(formCellControlProxy)) {
            let postingDateControl = libCom.getControlProxy(pageProxy, 'PostingDatePicker');
            postingDateControl.setValue(startDateTime.date());
        }

        let startTimeControl = libCom.getControlProxy(pageProxy, 'StartTimePicker');
        if (startTimeControl.change !== 'Yes') {
            startTimeControl.setValue(startDateTime.date());
        }
        startTimeControl.duration = 'Yes';
    }

}
