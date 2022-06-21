import libCommon from '../Common/Library/CommonLibrary';
import libWOStatus from './MobileStatus/WorkOrderMobileStatusLibrary';

const queryOption = '$select=*,Equipment/EquipId,FunctionalLocation/FuncLocIdIntern&$expand=MarkedJob,Equipment,FunctionalLocation,WODocuments,OrderMobileStatus_Nav';

export default function WorkOrderUpdateNav(context) {

    let binding = context.binding;

    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    let isLocal = !!binding['@sap.isLocal'];
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    libCommon.removeStateVariable(context, 'WODefaultPlanningPlant');
    libCommon.removeStateVariable(context, 'WODefaultWorkCenterPlant');
    libCommon.removeStateVariable(context, 'WODefaultMainWorkCenter');
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                //Set the global TransactionType variable to CREATE
                return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action', binding['@odata.readLink'] , queryOption);
            }
            return '';
        });
    }
    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action', binding['@odata.readLink'] , queryOption);
}
