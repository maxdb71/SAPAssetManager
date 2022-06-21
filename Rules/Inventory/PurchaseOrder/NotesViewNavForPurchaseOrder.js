import { NoteLibrary as NoteLib} from '../../Notes/NoteLibrary';

export default function NotesViewNavForPurchaseOrder(clientAPI) {
    
    // Set the transaction type before navigating to the Note View page
    let page = clientAPI.getPageProxy()._page._definition.getName();
    if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
        clientAPI.getPageProxy().setActionBinding(clientAPI.getPageProxy().binding);
        return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteViewNav.action');
    }
    return null;
}
