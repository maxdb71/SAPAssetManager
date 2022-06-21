import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';
import {TimeSheetLibrary as libTS} from './TimeSheetLibrary';

export default function TimeSheetDetailsTotalHours(context) {
    let date = context.getPageProxy().binding.Date;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], "$filter=Date eq datetime'" + date + "'")
        .then(function(timeEntries) {
            var hours = 0.0;
            timeEntries.forEach(function(element) {
                hours += libTS.getActualHours(context, element.Hours);
            });
            return ConvertDoubleToHourString(hours);

        });

}
