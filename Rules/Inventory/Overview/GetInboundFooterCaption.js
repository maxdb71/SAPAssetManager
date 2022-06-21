import GetIncomingGoodsCountToFooter from './GetIncomingGoodsCountToFooter';

export default function GetInboundFooterCaption(clientAPI) {
    return GetIncomingGoodsCountToFooter(clientAPI).then(count => {
        if (count && count > 0) {
            return clientAPI.localizeText('see_all');
        } 
        return clientAPI.localizeText('fetch_documents');
    });
}
