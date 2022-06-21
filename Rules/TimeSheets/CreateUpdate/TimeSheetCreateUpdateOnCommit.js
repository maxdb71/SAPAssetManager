import TimeSheetCreateUpdateDate from './TimeSheetCreateUpdateDate';
import FetchRequest from '../../Common/Query/FetchRequest';

export default function TimeSheetCreateUpdateOnCommit(context) {

    return createOverviewIfMissing(context).then(() => {

        let pageName = context.currentPage.id;

        let action;
        switch (pageName) {

            case 'TimeEntryCreateUpdatePageForWO':
            case 'TimeEntryCreateUpdatePage':
                action = '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateCreate.action';
                break;
            case 'TimeSheetEntryEditPage':
                action = '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateUpdate.action';
                break;

            default:
                return Promise.reject(false);

        }

        return context.executeAction(action);
    });
}


function createOverviewIfMissing(context) {

    let date = TimeSheetCreateUpdateDate(context);

    return new FetchRequest('CatsTimesheetOverviewRows').get(context, `datetime'${date}'`).catch(() => {
        // This is missing
        return createOverviewRow(context, date);
    });

}

function createOverviewRow(context, date) {
    context.getClientData().TimeSheetsOverviewRowDate = date;
    return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowCreate.action');
}
