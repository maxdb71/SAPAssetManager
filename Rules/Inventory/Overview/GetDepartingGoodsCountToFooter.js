import comLib from '../../Common/Library/CommonLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function GetDepartingGoodsCountToFooter(clientAPI) {
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
    if (!plant) {
        plant = '';
    }
    
    return comLib.getEntitySetCount(clientAPI, 'MyInventoryObjects', "$expand=StockTransportOrderHeader_Nav&$filter=(IMObject eq 'OB') or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant eq '" + plant + "') or (IMObject eq 'RS')",'/SAPAssetManager/Services/AssetManager.service').then(count => {
        if (count && count > 0) {
            return count;
        } 
        return '';
    });
}
