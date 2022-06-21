import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerName(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let name = wrapper.name();
    return libEval.evalIsEmpty(name) ? '-' : name;
}
