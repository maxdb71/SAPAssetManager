import comLib from '../../Common/Library/CommonLibrary';

export default function SideMenuAllDocumentCount(clientAPI) {
    return comLib.getEntitySetCount(clientAPI, 'MyInventoryObjects', '','/SAPAssetManager/Services/AssetManager.service').then(count => {
        return clientAPI.localizeText('all_documents_x', [count]);
    });
}
