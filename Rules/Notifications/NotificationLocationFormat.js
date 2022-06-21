import GetLocationInformation from '../Common/GetLocationInformation';
import {ValueIfExists} from '../Common/Library/Formatter';

export default function NotificationLocationFormat(context) {
    return GetLocationInformation(context).then(result => {
        return ValueIfExists(result, context.localizeText('no_location_available'));
    });
}
