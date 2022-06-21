import libCommon from '../Library/CommonLibrary';
import libNotif from '../../Notifications/NotificationLibrary';
import AssignmentType from '../Library/AssignmentType';
export default function ResetFlagsAndClosePage(pageProxy) {
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnWOChangesetFlag(pageProxy, false);
    libNotif.setAddFromJobFlag(pageProxy, false);
    libNotif.setAddFromMapFlag(pageProxy, false);
    libNotif.setAddFromOperationFlag(pageProxy, false);
    libNotif.setAddFromSuboperationFlag(pageProxy, false);
    libCommon.setStateVariable(pageProxy, 'FromOperationsList', false);
    AssignmentType.removeWorkOrderDefaultOverride();
    libCommon.clearDocDataOnClientData(pageProxy);
    return pageProxy.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');


}
