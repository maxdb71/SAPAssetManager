import {NoteLibrary as NoteLib} from '../NoteLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import Constants from '../../Common/Library/ConstantsLibrary';

export default function NoteUpdateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
    if (type && type.noteUpdateAction) {
        libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, true);        
        return clientAPI.executeAction(type.noteUpdateAction);
    }
}
