import GetLocationInformation from '../Common/GetLocationInformation';
import {ValueIfExists} from '../Common/Library/Formatter';

export default function FunctionalLocationLocationFormat(context) {
    return GetLocationInformation(context).then(result => {
        return ValueIfExists(result, context.localizeText('no_location_available'));
    });
}
