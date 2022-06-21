import GetDepartingGoodsCountToFooter from './GetDepartingGoodsCountToFooter';
import OutboundListNav from '../Outbound/OutboundListNav';

export default function OnOutboundFooterPress(clientAPI) {
    return GetDepartingGoodsCountToFooter(clientAPI).then(count => {
        if (count && count > 0) {
            return OutboundListNav(clientAPI);
        } 
        return clientAPI.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocuments.action');
    });
}
