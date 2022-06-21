import libCommon from '../Library/CommonLibrary';
import documentCreate from '../../Documents/Create/DocumentCreateBDS';
import resetFlags from './ResetFlags';
import Logger from '../../Log/Logger';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * After changeset success, reset the state variables
 */
export default function ChangeSetOnSuccess(pageProxy) {

    if (pageProxy.currentPage.id === 'SubOperationsListViewPage') {
        pageProxy.executeAction('/SAPAssetManager/Rules/WorkOrders/SubOperations/CreateUpdate/WorkOrderSubOperationListViewCaption.js');
    }

    if (pageProxy.currentPage.id === 'WorkOrderOperationsListViewPage') {
        pageProxy.executeAction('/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationListViewSetCaption.js');
    }

    if (libCommon.getStateVariable(pageProxy, 'attachmentCount') > 0) {
        return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'Doc')).then(() => {
            resetFlags(pageProxy);
            return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        }).catch((error) => {
            resetFlags(pageProxy);
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
        });
    } else {
        resetFlags(pageProxy);
        if (!libVal.evalIsEmpty(libCommon.getStateVariable(pageProxy, 'PartAdd'))) {
            libCommon.clearFromClientData(pageProxy, 'PartAdd', false);
            return pageProxy.executeAction('/SAPAssetManager/Actions/Toast/ToastMessageCreate.action'); 
        } else if (!libVal.evalIsEmpty(libCommon.getStateVariable(pageProxy, 'BOMPartAdd'))) {
            libCommon.clearFromClientData(pageProxy, 'BOMPartAdd', false);
            return pageProxy.executeAction('/SAPAssetManager/Actions/Toast/ToastMessageCreate.action'); 
        } else {
            return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        }
    }
}

