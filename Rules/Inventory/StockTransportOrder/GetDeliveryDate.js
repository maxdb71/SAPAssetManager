import common from '../../Common/Library/CommonLibrary';

export default function GetDeliveryDate(clientAPI) {
    var deliveryDates = [];
    let binding = clientAPI.getBindingObject();

    var queryOption ="$filter=PurchaseOrderId eq '" + binding.StockTransportOrderId + "' and ItemNum eq '" + binding.ItemNum + "'"; 
    
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'ScheduleLines', [], queryOption).then((result) => {
        if (result && result.length > 0) {
            for (var i = 0; i < result.length; ++i) {
                deliveryDates.push(common.dateStringToUTCDatetime(result.getItem(i).DeliveryDate));
            }
            var minDate = new Date(Math.min.apply(null,deliveryDates));
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);

            var minDateText = '';

            if (minDate.toDateString() === today.toDateString()) {
                minDateText = clientAPI.localizeText('today');
            } else if (minDate.toDateString() === tomorrow.toDateString()) {
                minDateText = clientAPI.localizeText('tomorrow');
            } else {
                minDateText = common.getFormattedDate(minDate, clientAPI);
            }            
            return minDateText;           
        }
        //return clientAPI.localizeText('error_missing_field', ['DeliveryDate']);
        return ''; //No schedule delivery date for this line
    });
}
