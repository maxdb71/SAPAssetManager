import libCom from '../../Common/Library/CommonLibrary';
import operationQueryOptions from './OperationPickerQueryOptions';
import libVal from '../../Common/Library/ValidationLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import OnOperationChangeListPickerUpdate, {redrawListControl} from './OnOperationChangeListPickerUpdate';

export default function OnWorkOrderChanged(context) {
    let binding = context.getBindingObject();
    let orderId = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let pageProxy = context.getPageProxy();
    let finalControl = libCom.getControlProxy(pageProxy, 'IsFinalConfirmation');
    
    let woLstPicker = libCom.getControlProxy(pageProxy, 'WorkOrderLstPkr');
     /* Clear the validation if the field is not empty */
     if (!libVal.evalIsEmpty(woLstPicker.getValue())) {
        woLstPicker.clearValidation();
     }

    if (orderId.length === 0) {
        if (binding.IsFinalChangable) { //Allow changing is final since no work order selected
            finalControl.setEditable(true);
        }
        //Unselected, clear dependent controls
        return onNoWorkOrder(pageProxy);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=OrderMobileStatus_Nav&$filter=OrderId eq '${orderId}'&$top=1`).then(result => {
        if (!result || result.length === 0) {
            return onNoWorkOrder(pageProxy);
        }
        let workOrder = result.getItem(0);
        return libSuper.checkReviewRequired(context, workOrder).then(review => {
            if (review && !libMobile.isSubOperationStatusChangeable(context)) { //If not sub-operation assignment and needs review, then don't allow final confirmation to be set by user
                finalControl.setValue(false);    
                finalControl.setEditable(false);
            } else if (binding.IsFinalChangable) {
                finalControl.setEditable(true);
            }
            return onWorkOrderReceived(pageProxy, orderId);
        });
    });
}

//Work order selected, so populate and enable the operation picker and other dependent pickers
function onWorkOrderReceived(pageProxy, orderTemp) {    
    return Promise.all([operationQueryOptions(pageProxy, orderTemp)]).then(function(operationResult) {
        return redrawListControl(pageProxy, 'OperationPkr', operationResult[0], true).then(() => {
            return OnOperationChangeListPickerUpdate(pageProxy);
        });
    });
}

//No work order, so blankout and disable dependent pickers
function onNoWorkOrder(pageProxy) {    
    redrawListControl(pageProxy, 'OperationPkr', '', false);
    redrawListControl(pageProxy, 'SubOperationPkr', '', false);
    redrawListControl(pageProxy, 'ActivityTypePkr', '', false);
    redrawListControl(pageProxy, 'VarianceReasonPkr', '', false);
    pageProxy.getControl('FormCellContainer').redraw();
    return Promise.resolve(true);
}
