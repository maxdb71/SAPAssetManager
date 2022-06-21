import libCommon from '../../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../../../Notes/NoteLibrary';

export default function WorkOrderOperationBatchCreate(pageProxy) {

    //set up the pending_* counter into client data
    setupPrimaryEntityPendingCounter(pageProxy);

    // check if we are in WorkOrder Create Changeset
    if (libCommon.isOnWOChangeset(pageProxy)) {

        //create all primary and dependent entities
        return runPrimaryEntityActions(pageProxy).then(() => {
            return Promise.all(getDependentEntityActions(pageProxy)).then(() => {
                return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
            });
        });
    } else {
        //create Operation and/or Operation long text
        return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreate.action').then((results) => {
            let dataObject = JSON.parse(results.data);
            libCommon.setStateVariable(pageProxy, 'LocalId', dataObject.OrderId);
            libCommon.setStateVariable(pageProxy, 'lastLocalOperationId', dataObject.OperationNo);
            let note = libCommon.getFieldValue(pageProxy, 'LongTextNote', '', null, true);
            if (note) {
                NoteLib.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.workOrderOperation());
                return pageProxy.executeAction('/SAPAssetManager/Actions/Notes/NotesCreateDuringOperationCreate.action');
            } else {
                return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
            }
        });
    }
}


/**
 * execute the WorkOrder and Operation create actions.
 * @param {*} context MDK Page - WorkOrderOperationAddPage
 * @returns {Promise} executeAction Promise
 */
function runPrimaryEntityActions(context) {
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreate.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreate.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/RelatedWorkOrders/RelatedWorkOrderCreate.action');
                });
        });
}

/**
 * get the (workorder and operation)'s dependent entities create action
 * WorkOrderLongText, WorkOrderPartner, OperationLongText
 * @param {*} context 
 * @returns {Array} array of promises
 */
function getDependentEntityActions(context) {
    let promises = [];

    //WorkOrderNote
    let note = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:LongTextNote/#Value');
    if (note) {
        //NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
        promises.push(context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringWOCreate.action'));
    }

    //WorkOrderPartner
    let assignmentType = libCommon.getWorkOrderAssignmentType(context);
    if (assignmentType === '1' || assignmentType === '7') {
        promises.push(context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderPartnerCreate.action'));
    }

    //OperationNote 
    let Opnote = libCommon.getTargetPathValue(context, '#Page:WorkOrderOperationAddPage/#Control:LongTextNote/#Value');
    if (Opnote) {
        //NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation());
        promises.push(context.executeAction('/SAPAssetManager/Actions/Notes/NotesCreateDuringOperationCreate.action'));
    }

    return promises;
}

/**
 * Setup the pending_* counter into the ClientData, whenever needed, they can be referenced using targetpath
 * such as #ClientData/#Property:PendingCounter/#Property:MyWorkOrderHeaders
 * @param {*} context 
 */
function setupPrimaryEntityPendingCounter(context) {

    let result;

    if (libCommon.isOnWOChangeset(context)) {
        result = {
            MyWorkOrderHeaders: 'pending_1',
            MyWorkOrderOperations: 'pending_2',
        };
    } else {
        result = {
            MyWorkOrderOperations: 'pending_1',
        };
    }

    context.getClientData().PendingCounter = result;
}
