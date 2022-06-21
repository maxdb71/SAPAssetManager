import libCommon from '../Common/Library/CommonLibrary';
import {NoteLibrary as NoteLib} from './NoteLibrary';

export default function NoteCreateOnSuccess(context) {

    if (!libCommon.isOnWOChangeset(context)) {
        let onChangeSet = libCommon.isOnChangeset(context);

        if (onChangeSet) {
            libCommon.incrementChangeSetActionCounter(context);
            context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        } else {
            return NoteLib.createSuccessMessage(context);
        }
    }
}
