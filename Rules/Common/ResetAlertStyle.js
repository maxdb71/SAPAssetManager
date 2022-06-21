
import IsAndroid from './IsAndroid';

export default function ResetAlertStyle(context) {
    return IsAndroid(context) ? 'FormCellButton' : 'ResetRed';
}
