import libCommon from '../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../SideDrawer/EnableMaintenanceTechnician';

export default function IsGISEnabled(context) {
    if (enableMaintenanceTechnician(context)) {
        return (libCommon.getAppParam(context,'GIS','Enable') === 'Y');
    }
    return false;
}
