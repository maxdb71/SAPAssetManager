import getIncomingGoodsCountToFooter from './GetIncomingGoodsCountToFooter';

export default function SideMenuInboundDocumentCount(clientAPI) {
    return getIncomingGoodsCountToFooter(clientAPI).then(count => {
        return clientAPI.localizeText('inbound_x', [count]);
    });
}
