
import CommonLib from '../Common/Library/CommonLibrary';

export default function LAMIsEnabled(context) {
    let isEnabled = CommonLib.getAppParam(context, 'LAM', 'Enable');
    return isEnabled === 'Y';
}
