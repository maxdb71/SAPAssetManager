
import CommonLib from '../Common/Library/CommonLibrary';

export default function ConfirmationsIsEnabled(context) {
    let isEnabled = CommonLib.getAppParam(context, 'PMCONFIRMATION', 'Enable');
    return isEnabled === 'Y';
}
