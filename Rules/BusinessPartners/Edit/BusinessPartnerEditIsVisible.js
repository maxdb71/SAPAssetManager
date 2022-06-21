import {GlobalVar as globals} from '../../Common/Library/GlobalCommon';
import libComm from '../../Common/Library/CommonLibrary';
import {BusinessPartnerWrapper} from '../BusinessPartnerWrapper';
export default function BusinessPartnerEditIsVisible(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let address = wrapper.address();
    /// Address creation is not supported on the backend. Edit button is disable if address does not exists.
    if (!libComm.isDefined(address)) {
        context.setActionBarItemVisible(0, false);
    }
    if (context.binding.PartnerFunction_Nav.PartnerType === globals.getAppParam().PARTNERFUNCTION.PersonelNumber) {
        context.setActionBarItemVisible(0, false);
    } else {
        context.setActionBarItemVisible(0, true);
    }
}
