import libVal from '../../Common/Library/ValidationLibrary';
/**
* Return a array with all the details of ID's from child to the parent
* @param {IClientAPI} context
*/
export default function SignatureObjectDetails(context) {
    let objectDetails = [];
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding['@odata.type']) && !libVal.evalIsEmpty(binding.WorkOrderHeader)) {
        binding = binding.WorkOrderHeader;
    }
    switch (binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader': {
            objectDetails.push(binding.OrderId);
            if (!libVal.evalIsEmpty(binding.OperationNo)) {
                objectDetails.push(binding.OperationNo);
            } 
            if (!libVal.evalIsEmpty(binding.SubOperationNo)) {
                objectDetails.push(binding.SubOperationNo);
            }
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            objectDetails.push(binding.WOHeader.OrderId);
            objectDetails.push(binding.OperationNo);
            break;
        }
        case '#sap_mobile.MyWorkOrderSubOperation': {
            objectDetails.push(binding.WorkOrderOperation.WOHeader.OrderId);
            objectDetails.push(binding.WorkOrderOperation.OperationNo);
            objectDetails.push(binding.SubOperationNo);
            break;
        }
    }
    return 'ID:' + objectDetails.join('-');
}
