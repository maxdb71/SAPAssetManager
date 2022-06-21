import CommonLibrary from '../Common/Library/CommonLibrary';

export default function WorkOrderOperationsCount(context) {
    return CommonLibrary.getEntitySetCount(context,'MyWorkOrderOperations','');
}
