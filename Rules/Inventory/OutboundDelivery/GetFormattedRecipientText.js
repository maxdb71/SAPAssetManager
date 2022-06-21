import common from '../../Common/Library/CommonLibrary';

export default function GetFormattedRecipientText(clientAPI) {

    var outboundDeliveryDoc = clientAPI.binding;
    var receivingPlant = outboundDeliveryDoc.ReceivingPlant;
    var shipToParty = outboundDeliveryDoc.ShipToParty;

    if (receivingPlant) {
        return common.getPlantName(clientAPI, receivingPlant);
    } else if (shipToParty) {
        return common.getCustomerName(clientAPI, shipToParty);
    } else {
        return '';
    }

}
