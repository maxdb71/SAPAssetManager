/**
* Describe this function...
* @param {IClientAPI} formCellControlProxy
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function StartTimeOnValueChange(formCellControlProxy) {
    if (formCellControlProxy.getPageProxy().binding.IsOnCreate) {
        let pageProxy = formCellControlProxy.getPageProxy();
        let startTimeControl = libCom.getControlProxy(pageProxy, 'StartTimePicker');
        if (startTimeControl.duration === 'Yes' && startTimeControl.change === 'No') {
            startTimeControl.change = 'No';
            startTimeControl.duration = 'No';
        } else if (startTimeControl.change === 'No' || startTimeControl.change === 'Yes') {
            startTimeControl.change = 'Yes';
        } else {
            startTimeControl.change = 'No';
        }

    }
}
