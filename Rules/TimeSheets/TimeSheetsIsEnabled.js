
import CommonLib from '../Common/Library/CommonLibrary';

export default function TimeSheetsIsEnabled(context) {
    let isEnabled = CommonLib.getAppParam(context, 'TIMESHEET', 'Enable');
    return isEnabled === 'Y';
}
