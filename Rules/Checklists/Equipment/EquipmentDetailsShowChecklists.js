import libCommon from '../../Common/Library/CommonLibrary';
import checkListCount from './EquipmentChecklistsCount';
import allowCreate from './AllowChecklistCreateEquipment';

export default function equipmentDetailsShowChecklists(context) {

    if (libCommon.getAppParam(context, 'CHECKLISTS', 'Enable') === 'Y') { //Checklists are enabled in backend
        return checkListCount(context).then(count => {
            return allowCreate(context).then(value => {
                if (count > 0 || value) { //Checklists exist for this equipment, or master data exists for creating new checklists
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            });
        });
    }
    return Promise.resolve(false);
}
