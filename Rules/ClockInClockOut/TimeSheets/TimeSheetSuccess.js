import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function TimeSheetSuccess(context) {
    //Handle removing clock in/out records after time entry
    libCommon.setStateVariable(context, 'ClockTimeSaved', true);
    return libClock.removeUserTimeEntries(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
    });
}
