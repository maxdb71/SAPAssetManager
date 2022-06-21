import getDepartingGoodsCountToFooter from './GetDepartingGoodsCountToFooter';

export default function SideMenuOutboundDocumentCount(clientAPI) {
    return getDepartingGoodsCountToFooter(clientAPI).then(count => {
        return clientAPI.localizeText('outbound_x', [count]);
    });
}
