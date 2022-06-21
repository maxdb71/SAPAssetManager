export default function RejectReasonText(context) {
    
    let businessObject = context.getPageProxy().binding;
    let code = '';

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        if (businessObject.OrderMobileStatus_Nav) {
            code = businessObject.OrderMobileStatus_Nav.ReasonCode;
        }
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (businessObject.OperationMobileStatus_Nav) {
            code = businessObject.OperationMobileStatus_Nav.ReasonCode;
        }
    }
    if (code.replace(/^0*/, '')) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', "RejectionReasons('" + code + "')", ['ReasonDescription'], '').then(result => {
            if (result && result.length > 0) {
                let row = result.getItem(0);
                return row.ReasonDescription;
            }
            return '';
        });
    }
    return '';
}
