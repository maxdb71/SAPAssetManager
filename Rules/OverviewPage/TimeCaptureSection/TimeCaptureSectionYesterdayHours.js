import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetYesterdayHours from '../../TimeSheets/TimeSheetsYesterdaysHours';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import ODataDate from '../../Common/Date/ODataDate';

export default function TimeCaptureSectionYesterdayHours(context) {

    return TimeCaptureTypeHelper(context, ConfirmationYesterdayHours, TimeSheetYesterdayHours);
}

function ConfirmationYesterdayHours(context) {

    let odataDate = new ODataDate();
    let date = new Date(odataDate.toDBDateString());
    date.setDate(date.getDate() - 1);
    return ConfirmationTotalDuration(context, date).then(hours => {
        return context.localizeText('x_hours', [hours]);
    });
}
