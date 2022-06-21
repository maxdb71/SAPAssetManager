import DocLib from '../DocumentLibrary';

export default function DocumentCreateBDSLinkNoClose(controlProxy) {
    const parentReadLink = controlProxy.binding['@odata.readLink'];
    const serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let promises = [];
    let entitySet = '';
    let parentEntitySet = '';
    let parentProperty = '';

    let objectKey = '';

    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            entitySet = 'MyWorkOrderDocuments';
            parentEntitySet = 'MyWorkOrderHeaders';
            parentProperty = 'WOHeader';
            objectKey = controlProxy.binding.OrderId;
            break;
        case DocLib.ParentObjectType.Notification:
            entitySet = 'MyNotifDocuments';
            parentEntitySet = 'MyNotificationHeaders';
            parentProperty = 'NotifHeader';
            objectKey = controlProxy.binding.NotificationNumber;
            break;
        case DocLib.ParentObjectType.Equipment:
            entitySet = 'MyEquipDocuments';
            parentEntitySet = 'MyEquipments';
            parentProperty = 'Equipment';
            objectKey = controlProxy.binding.EquipId;
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            entitySet = 'MyFuncLocDocuments';
            parentEntitySet = 'MyFunctionalLocations';
            parentProperty = 'FunctionalLocation';
            objectKey = controlProxy.binding.FuncLocIdIntern;
            break;
        case DocLib.ParentObjectType.Operation:
            entitySet = 'MyWorkOrderDocuments';
            parentEntitySet = 'MyWorkOrderOperations';
            parentProperty = 'WOOperation_Nav';
            if (controlProxy.binding.OperationNo[0] === 'L') {
                objectKey = controlProxy.binding.OperationNo;
            } else {
                objectKey = controlProxy.binding.ObjectKey;
            }
            break;
        default: 
            break;
    }

    const properties = {ObjectKey: objectKey};

    const readLinks = controlProxy.getClientData().mediaReadLinks;
    if (readLinks && parentReadLink) {
        for (let readLink of readLinks) {
            let links = [];
            let link = controlProxy.createLinkSpecifierProxy(parentProperty, parentEntitySet, '', parentReadLink);
            links.push(link);
            link = controlProxy.createLinkSpecifierProxy('Document', 'Documents', '', readLink);
            links.push(link);
            promises.push(controlProxy.create(serviceName, entitySet, properties, links, {'OfflineOData.RemoveAfterUpload':'true'}));
        }
    }

    return Promise.all(promises).then(() => true)
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
