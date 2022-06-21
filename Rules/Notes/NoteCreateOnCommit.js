import { NoteLibrary as NoteLib } from './NoteLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Constants from '../Common/Library/ConstantsLibrary';

export default function NoteCreateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
    if (!type) {
        throw new TypeError('Note Transaction Type must be defined');
    }
    let note = libCommon.getStateVariable(clientAPI, Constants.noteStateVariable);
    if (note) {
        if (type.noteUpdateAction) {
            libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, false);
            return clientAPI.executeAction(type.noteUpdateAction).then(() => {
                libCommon.setOnCreateUpdateFlag(clientAPI, '');
             });
        }
    } else if (type.noteCreateAction) {
        return clientAPI.executeAction(type.noteCreateAction).then(() => {
            libCommon.setOnCreateUpdateFlag(clientAPI, '');
         });
    }
}
