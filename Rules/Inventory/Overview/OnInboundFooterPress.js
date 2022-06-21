import GetIncomingGoodsCountToFooter from './GetIncomingGoodsCountToFooter';
import InboundListNav from '../Inbound/InboundListNav';

export default function OnInboundFooterPress(clientAPI) {
    return GetIncomingGoodsCountToFooter(clientAPI).then(count => {
        if (count && count > 0) {
            return InboundListNav(clientAPI);
        } 
        return clientAPI.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocuments.action');
    });
}
