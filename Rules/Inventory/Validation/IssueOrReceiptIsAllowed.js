
import libCom from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptIsAllowed(context) {

    let type = libCom.getStateVariable(context, 'IMMovementType');
    let object = libCom.getStateVariable(context, 'IMObjectType');

    let binding = context.getPageProxy().getActionBinding();
    let open;
    let deliveryCompleteFlag;
    let finalDeliveryFlag = '';

    if (type === 'R') {  //Receipts 
        if (object === 'PO') {
            open = Number(binding.OpenQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
            finalDeliveryFlag = binding.FinalDeliveryFlag;
        } else if (object === 'STO') {
            open = Number(binding.IssuedQuantity) - Number(binding.ReceivedQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
            finalDeliveryFlag = binding.FinalDeliveryFlag;
        }
    } else if (type === 'I') { //Issues
        if (object === 'RES') {
            open = Number(binding.RequirementQuantity) - Number(binding.WithdrawalQuantity);
            deliveryCompleteFlag = binding.Completed;
        } else if (object === 'STO') {
            open = Number(binding.OrderQuantity) - Number(binding.IssuedQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
            finalDeliveryFlag = binding.FinalDeliveryFlag;
        }
    }

    //If no open quantity or delivery completed flag is set, don't allow further goods movement on this line item
    if (open <= 0 || deliveryCompleteFlag === 'X' || finalDeliveryFlag === 'X') {
        return false;
    }
    return true;
}
