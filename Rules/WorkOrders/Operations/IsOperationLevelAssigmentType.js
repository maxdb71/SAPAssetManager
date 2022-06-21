import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import libCommon from '../../Common/Library/CommonLibrary';

export default function IsOperationLevelAssigmentType(context) {
     if (enableMaintenanceTechnician(context)) {
          //Return true if Operation level assigment type
          return (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation');
     }
     return false;
}
