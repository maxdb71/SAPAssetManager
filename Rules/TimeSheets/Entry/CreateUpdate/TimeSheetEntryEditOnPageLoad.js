import { TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import style from '../../../Common/Style/StyleFormCellButton';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../../Common/Library/CommonLibrary';

export default function TimeSheetEntryEditOnPageLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
    libTSEvent.TimeSheetEntryEditOnPageLoad(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
}
