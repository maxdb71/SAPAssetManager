import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libCom from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerTelephone(context) {
    let pageName = libCom.getPageName(context);
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let telephoneLong = wrapper.communicationProperty('Telephone');
    let telephoneShort = wrapper.communicationProperty('TelephoneShort');
    let extension = wrapper.communicationProperty('Extension');
    let telephone = '';

    let isOnEditPage = pageName === 'BusinessPartnerEditPage';
    if (isOnEditPage) {
        telephone = telephoneShort;
    } else {
        telephone = telephoneLong;
    }

    if (!libEval.evalIsEmpty(extension) && !isOnEditPage) {
        let ext_idx = telephoneLong.length - extension.length;
        if (ext_idx > 0) {
            telephone = telephoneLong.substring(0, ext_idx);
        }
    }
    
    let emptyVal = isOnEditPage ? '' : '-';

    if (libEval.evalIsEmpty(telephoneLong)) return emptyVal;

    if (!isOnEditPage && !libEval.evalIsEmpty(extension)) {
        telephone = context.localizeText('telephone_w_ext', [telephone, extension]);
    }
    return telephone;       
}
