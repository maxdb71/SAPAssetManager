import ComLib from '../../../../Common/Library/CommonLibrary';
import NotificationLib from '../../../../Notifications/NotificationLibrary';

export default function NotificationItemCauseCreateUpdateOnCommit(clientAPI) {

    return NotificationLib.NotificationItemCauseCreateUpdateValidation(clientAPI).then((isValid) => {
        if (isValid) {
            if (ComLib.IsOnCreate(clientAPI))	{
                ComLib.resetChangeSetActionCounter(clientAPI);
                ComLib.setOnChangesetFlag(clientAPI, true);
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreateChangeSet.action');
            } else {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseUpdate.action');
            }
        } else {
            return Promise.resolve(false);
        }
    });    
}
