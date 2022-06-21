import isAndroid from './IsAndroid';
import deviceType from './DeviceType';

export default function SyncIconOnGrid(context) {
    if (context.getBindingObject()['@sap.isLocal']) {
        if (isAndroid(context)) {
            switch (deviceType(context)) {
                case 'Phone':
                    return '/SAPAssetManager/Images/syncOnListIconGridPhone.android.png';
                case 'Tablet':
                    return '/SAPAssetManager/Images/syncOnListIcon.android.png';
                default:
                    break;
            }
        } else {
            switch (deviceType(context)) {
                case 'Phone':
                    return '/SAPAssetManager/Images/syncOnListIconGridPhone.png';
                case 'Tablet':
                    return '/SAPAssetManager/Images/syncOnListIcon.png';
                default:
                    break;
            }
        }
    }
    return '';
}
