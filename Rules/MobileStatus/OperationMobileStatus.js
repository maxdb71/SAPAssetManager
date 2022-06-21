import libMobile from './MobileStatusLibrary';

export default function OperationMobileStatus(context) {
    let binding = context.binding;
    if (binding && binding.OperationNo && libMobile.isOperationStatusChangeable()) {
        return context.localizeText(libMobile.getMobileStatus(context.binding, context));  
    } else {
        return '';
    }
}
