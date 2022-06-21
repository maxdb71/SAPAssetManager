import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetTodayHours from '../../TimeSheets/TimeSheetsTodaysHours';
import ODataDate from '../../Common/Date/ODataDate';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';

export default function TimeCaptureSectionTodayHours(context) {

    return TimeCaptureTypeHelper(context, ConfirmationTodayHours, TimeSheetTodayHours);
}

function ConfirmationTodayHours(context) {

    let odataDate = new ODataDate();
    let date = new Date(odataDate.toDBDateString());
    return ConfirmationTotalDuration(context, date).then(hours => {
        return context.localizeText('x_hours', [hours]);
    });
}
