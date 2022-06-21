import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateEquipmentValue(pageProxy) {
    return LibWoControls.getEquipment(pageProxy);
}
