/**
* This function returns the material document ids which are related to a PO/STO
*/
export default function GetRelatedMaterialDocsFilter(clientAPI) {

    let type = clientAPI.binding['@odata.type'].substring('#sap_mobile.'.length);
    let target;
    var queryOptions;

    if (type === 'PurchaseOrderHeader') {
        target = clientAPI.binding.PurchaseOrderId;
        queryOptions = "$filter=PurchaseOrderNumber eq '" + target + "'";
    } else if (type === 'StockTransportOrderHeader') {
        target = clientAPI.binding.StockTransportOrderId;
        queryOptions = "$filter=PurchaseOrderNumber eq '" + target + "'";
    } else if (type === 'ReservationHeader') {
        target = clientAPI.binding.ReservationNum;
        queryOptions = "$filter=ReservationNumber eq '" + target + "'";
    } 

    var queryOptions2Return = '$filter=';
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MaterialDocNumber'], queryOptions).then((result) => {
        if (result) {
            if (result.length > 0) {
                var matDocNmbrs = [];
                for (var i = 0; i < result.length; ++i) {
                    matDocNmbrs.push(result.getItem(i).MaterialDocNumber);  
                }
                let uniqueNmbrs = new Set(matDocNmbrs); //De-duplicate the list

                uniqueNmbrs.forEach((materialDocumentNum) => {
                    queryOptions2Return += "MaterialDocNumber eq '" + materialDocumentNum + "' or ";
                });
                queryOptions2Return = queryOptions2Return.substring(0,queryOptions2Return.length-4);
                queryOptions2Return += '&$orderby=MaterialDocNumber desc';

                return queryOptions2Return;
            } else {
                return '$filter=1 eq 2';
            }
        } else {
            return clientAPI.localizeText('error_missing_field',['PurchaseOrderNumber']);
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(err => {
        return -1;
    });
}
 
