import libCommon from '../../Common/Library/CommonLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { ChecklistLibrary as libChecklist } from '../../Checklists/ChecklistLibrary';

export default function WorkOrderCompleteStatus(context) {
    //ChangeStatus is used by WorkOrderMobileStatusFailureMessage.action & WorkOrderMobileStatusSuccessMessage.action
    context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    var isStatusChangeable = libMobile.isHeaderStatusChangeable(context);
    if (isStatusChangeable) {
        let binding = libCommon.getBindingObject(context);
        var equipment = binding.HeaderEquipment;
        var functionalLocation = binding.HeaderFunctionLocation;
        return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                return libWOMobile.completeWorkOrder(context);
            } else {
                return Promise.resolve(true);
            }
        }).finally(() => {
            delete context.getPageProxy().getClientData().ChangeStatus;     
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').finally(() => {
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
}
