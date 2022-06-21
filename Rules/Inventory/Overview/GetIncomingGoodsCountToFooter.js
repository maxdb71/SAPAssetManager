import comLib from '../../Common/Library/CommonLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function GetIncomingGoodsCountToFooter(clientAPI) {
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
    if (!plant) {
        plant = '';
    }
    
    return comLib.getEntitySetCount(clientAPI, 'MyInventoryObjects', "$expand=StockTransportOrderHeader_Nav&$filter=IMObject eq 'PO' or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant ne '" + plant + "') or IMObject eq 'IB'", '/SAPAssetManager/Services/AssetManager.service').then(count => {
        if (count && count > 0) {
            return count;
        } 
        return '';
    });
}
