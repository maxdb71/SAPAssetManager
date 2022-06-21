import libCommon from '../../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';

export default function IsInspectionLotEnabled(context) {
    if (enableMaintenanceTechnician(context)) {
        return (libCommon.getAppParam(context,'EAM_CHECKLIST','Enable') === 'Y');
    }
    return false;
}
