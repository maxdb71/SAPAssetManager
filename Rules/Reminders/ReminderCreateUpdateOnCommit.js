import ComLib from '../Common/Library/CommonLibrary';

export default function ReminderCreateUpdateOnCommit(clientAPI) {
    let onCreate = ComLib.IsOnCreate(clientAPI);
    if (onCreate) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Reminders/ReminderCreate.action').then(() => {
           ComLib.setOnCreateUpdateFlag(clientAPI, '');
        });
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Reminders/ReminderUpdate.action').then(() => {
            ComLib.setOnCreateUpdateFlag(clientAPI, '');
         });
    }
}
