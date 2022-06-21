import { TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default function TimeSheetEntryCreateUpdateOnPageLoad(pageClientAPI) {
    libTSEvent.TimeSheetEntryCreateUpdateOnPageLoad(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
}
