import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';
import {OperationControlLibrary as controls} from '../WorkOrderOperationLibrary';
import assignmentType from '../../../Common/Library/AssignmentType';

export default function WorkOrderOperationCreateUpdateOnCommit(pageProxy) {
    return libOperationEvent.createUpdateValidationRule(pageProxy).then((result) => {
        if (result) {
            assignmentType.setWorkOrderFieldDefault('WorkCenterPlant', controls.getWorkCenterPlant(pageProxy));
            assignmentType.setWorkOrderFieldDefault('MainWorkCenter', controls.getMainWorkCenter(pageProxy));
            return libOperationEvent.createUpdateOnCommit(pageProxy);
        }

        return Promise.resolve(false);
    });
}
