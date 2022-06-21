/**
* This function returns the material document ids which are related to a purchase order
*/
export default function GetRelatedMaterialDocsFilter(clientAPI) {
    var queryOptions2Return = '$filter=';
    var queryOptions = "$filter=Delivery eq '" + clientAPI.binding.DeliveryNum +"'";
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], queryOptions).then((result) => {
        if (result) {
            if (result.length > 0) {
                var matDocNmbrs = [];
                for (var i = 0; i < result.length; ++i) {
                    matDocNmbrs.push(result.getItem(i).MaterialDocNum);  
                }
                let uniqueNmbrs = new Set(matDocNmbrs);

                uniqueNmbrs.forEach((materialDocumentNum) => {
                    queryOptions2Return += "MaterialDocNum eq '" + materialDocumentNum + "' or ";
                });
            
                return queryOptions2Return.substring(0,queryOptions2Return.length-4);
            } else {
                return '$filter=1 eq 2';
            }
        } else {
            return '$filter=1 eq 2';
        }
    });
}
 
