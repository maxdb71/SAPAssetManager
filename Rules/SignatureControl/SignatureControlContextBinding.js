import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
export default function SignatureControlContextBinding(context) {
    let parent  = libVal.evalIsEmpty(context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject) ? context.evaluateTargetPathForAPI('#Page:-Previous').binding : context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject;
     ///Get context menu binding 
     if (libCommon.getStateVariable(context, 'ContextMenuBindingObject')) {
        parent = libCommon.getStateVariable(context, 'ContextMenuBindingObject');
    }
    if (libVal.evalIsEmpty(parent['@odata.type']) && !libVal.evalIsEmpty(parent.WorkOrderHeader)) {
        parent = parent.WorkOrderHeader;
    }
    switch (parent['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader': {
            context._context.binding = parent;
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            context._context.binding = parent.WOHeader;
            break;
        }
        case '#sap_mobile.MyWorkOrderSubOperation':  {
            context._context.binding = parent.WorkOrderOperation.WOHeader;
            break;
        }
    }
   return context;
}
