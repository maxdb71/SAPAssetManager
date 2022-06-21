import comLib from '../../Common/Library/CommonLibrary';

export default function GetGoodsMovementCountToFooter(clientAPI) {
    return comLib.getEntitySetCount(clientAPI, 'MaterialDocuments', '$filter=sap.islocal()','/SAPAssetManager/Services/AssetManager.service');
}
