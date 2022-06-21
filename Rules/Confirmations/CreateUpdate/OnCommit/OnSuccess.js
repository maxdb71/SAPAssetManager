
export default function OnSuccess(context, isOnCreate=true) {

    let prevClientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let action;

    if (prevClientData.workingReadLink !== undefined) { 
        action = '/SAPAssetManager/Actions/Page/ClosePage.action';
    } else if (isOnCreate) {
        action = '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action';
    } else {
        action = '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action';
    }
    return context.executeAction(action);
}
