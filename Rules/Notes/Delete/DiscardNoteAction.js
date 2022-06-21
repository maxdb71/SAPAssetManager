import {NoteLibrary as NoteLib} from '../NoteLibrary';
import ComLib from '../../Common/Library/CommonLibrary';
import Constants from '../../Common/Library/ConstantsLibrary';

export default function DiscardNoteAction(context) {
    //finding object type. Using split as the data is coming as "@sap_mobile.EntityName"
    return context.executeAction('/SAPAssetManager/Actions/Notes/NoteDiscardDialog.action').then(result => {
        if (result.data === true) {
            let transaction = NoteLib.getNoteTypeTransactionFlag(context);
            if (transaction.noteDeleteAction) {
                ComLib.setStateVariable(context, Constants.stripNoteNewTextKey, true);
                return context.executeAction(transaction.noteDeleteAction);
            }
        }
        return Promise.resolve();
    });
}
