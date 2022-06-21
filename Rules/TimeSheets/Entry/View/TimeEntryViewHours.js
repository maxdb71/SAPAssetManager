
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';

export default function TimeEntryViewHours(context) {
    var hours = libTS.getActualHours(context, context.binding.Hours);

    return ConvertDoubleToHourString(hours);
}
