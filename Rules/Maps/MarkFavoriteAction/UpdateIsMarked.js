import MarkedJobLibrary from '../../MarkedJobs/MarkedJobLibrary';

export default function UpdateIsMarked(context) {

    let action;
    if (MarkedJobLibrary.isMarked(context)) {
        // unmark if marked
        action = MarkedJobLibrary.unmark(context);
    } else {
        // else mark if unmarked
        action = MarkedJobLibrary.mark(context);
    }

    return action.then(() => {
        context.getControl('MapExtensionControl')._control.userActionUpdate();
    }).catch(() => {
        context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobUpdateFailed.action');
    });
}
