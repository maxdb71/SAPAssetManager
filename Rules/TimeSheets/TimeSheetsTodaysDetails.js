import TimeSheetData from './TimeSheetsData';
import Logger from '../Log/Logger';

export default function TimeSheetsTodaysDetails(context) {
    return TimeSheetData(context, new Date()).then((data) => {
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
            'Date': new Date(),
        });
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
    });
}
