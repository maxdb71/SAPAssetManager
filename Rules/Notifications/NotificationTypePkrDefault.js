import libCommon from '../Common/Library/CommonLibrary';

export default function NotificationTypeLstPkrDefault(context) {

    let bindingObject = context.binding;

    if (bindingObject['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${bindingObject.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${bindingObject.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).EAMNotifType;
            }
            return libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');
        });
    }

    if (bindingObject && bindingObject.NotificationType) {
        return bindingObject.NotificationType;
    } else {
        return libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');
    }
}
