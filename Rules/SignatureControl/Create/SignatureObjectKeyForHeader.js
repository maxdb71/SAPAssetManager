import libVal from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
export default function SignatureObjectKeyForHeader(controlProxy) {
    let object  = libVal.evalIsEmpty(controlProxy.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject) ? controlProxy.evaluateTargetPathForAPI('#Page:-Previous').binding : controlProxy.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject;
    ///Get context menu binding 
    if (libCommon.getStateVariable(controlProxy, 'ContextMenuBindingObject')) {
        object = libCommon.getStateVariable(controlProxy, 'ContextMenuBindingObject');
    }
    if (libVal.evalIsEmpty(object['@odata.type']) && !libVal.evalIsEmpty(object.WorkOrderHeader)) {
        object = object.WorkOrderHeader;
    }
    let value = '';
    switch (object['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader': {
            value = object['@odata.readLink'];
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            value = object.WOHeader['@odata.readLink'];
            break;
        }
        case '#sap_mobile.MyWorkOrderSubOperation': {
            value = object.WorkOrderOperation.WOHeader['@odata.readLink'];
        }
    }
    value += ':OrderId';
    return '<' + value + '>';
}
