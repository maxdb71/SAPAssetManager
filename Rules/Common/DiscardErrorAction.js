export default function DiscardErrorAction(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardErrorWarningMessage.action').then(result => {
        if (result.data === true) {
            return context.executeAction('/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action').then( ()=> {
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    });
}
