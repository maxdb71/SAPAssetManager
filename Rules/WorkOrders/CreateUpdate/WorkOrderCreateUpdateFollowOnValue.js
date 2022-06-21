import {WorkOrderLibrary} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateFollowOnValue(context) {
    if (context.getValue()) {
        WorkOrderLibrary.setFollowOnFlag(context, true);
    } else {
        WorkOrderLibrary.setFollowOnFlag(context, false);
    }
}
