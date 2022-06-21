import GetDepartingGoodsCountToFooter from './GetDepartingGoodsCountToFooter';

export default function GetOutboundFooterCaption(clientAPI) {
    return GetDepartingGoodsCountToFooter(clientAPI).then(count => {
        if (count && count > 0) {
            return clientAPI.localizeText('see_all');
        } 
        return clientAPI.localizeText('fetch_documents');
    });
}
