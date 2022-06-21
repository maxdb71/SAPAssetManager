import common from '../../Common/Library/CommonLibrary';

export default function GetPOItemDeliveryDate(clientAPI) {
    var binding = clientAPI.getBindingObject();    
    var queryOptions = '$filter=PurchaseOrderId eq' + "'" + binding.PurchaseOrderId + "'" + ' and ItemNum eq' + "'" + binding.ItemNum + "'";
    
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'ScheduleLines', [], queryOptions).then(result => {
        if (result && result.length > 0) {
            var dDate = result.getItem(0).DeliveryDate;
            var date = common.dateStringToUTCDatetime(dDate);
            return common.getFormattedDate(date, clientAPI);
        }
        return '';
    });
}
