import TimeSheetData from './TimeSheetsData';
import Logger from '../Log/Logger';

export default function TimeSheetsYesterdaysDetails(context) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return TimeSheetData(context, date).then((data) => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheetOverviewRows', [], "$filter=Date eq datetime'" + data.Date + "'").then(function(results) {
            if (results && results.getItem(0)) {
                context.getPageProxy().setActionBinding(results.getItem(0));
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
            } else {
                return Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), 'Record for Date ' + data.Date + ' not found in CatsTimesheetOverviewRows');
            }
        });
    }).catch(() => {
        context.getPageProxy().setActionBinding({
            'Date': date,
        });
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
    });

}
