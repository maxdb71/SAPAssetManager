import libVal from '../../Common/Library/ValidationLibrary';

export default class {
    
    static createItemSerialNumber(context, addCounter) {
        let binding;
        let action = '';

        if (!libVal.evalIsEmpty(context.getActionBinding())) {
            binding = context.getActionBinding();
        } else if (!libVal.evalIsEmpty(context.binding)) {
            binding = context.binding;
        }

        if (!libVal.evalIsEmpty(binding.TempLine_MatDocItemReadLink)) {
            // edit material document item
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumCreateRelated.action';
        } else if (libVal.evalIsEmpty(binding.TempHeader_MatDocReadLink)) {
            // create material doc item and  material doc  - changeset 
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumCreate.action';
        } else {
            // create realted material doc item with existing material doc
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumCreateRelated.action';
        }

        if (!libVal.evalIsEmpty(binding.TempLine_SerialNumbers)) {
            if (libVal.evalIsEmpty(addCounter)) {
                addCounter = 0;
            }
            let serialNums = binding.TempLine_SerialNumbers;
            if (addCounter === serialNums.length) {
                return Promise.resolve(true);
            } else {
                binding.TempLine_SerialNumber = serialNums[addCounter];
                return context.executeAction(action).then(() => {
                    addCounter = addCounter + 1;
                    return this.createItemSerialNumber(context, addCounter);
                });
            }
        }
        return Promise.resolve(true);
    }

    static deleteItemSerialNumber(context, deleteCounter) {
        let binding;
        if (!libVal.evalIsEmpty(context.getActionBinding())) {
            binding = context.getActionBinding();
        } else if (!libVal.evalIsEmpty(context.binding)) {
            binding = context.binding;
        }
        if (!libVal.evalIsEmpty(binding.SerialNum)) {
            if (libVal.evalIsEmpty(deleteCounter)) {
                deleteCounter = 0;
            }
            let serialNums = binding.SerialNum;
            if (deleteCounter === serialNums.length) {
                return Promise.resolve(true);
            } else {
                binding.TempLine_SerialNumber = serialNums[deleteCounter].SerialNum;
                binding.TempLine_SerialNumber_ReadLink = serialNums[deleteCounter]['@odata.readLink'];
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumDelete.action').then(() => {
                    deleteCounter = deleteCounter + 1;
                    return this.deleteItemSerialNumber(context, deleteCounter);
                });
            }
        }
        return Promise.resolve(true);
    }

    static updateItemSerialNumber(context) {
        return this.deleteItemSerialNumber(context).then(() => {
            return this.createItemSerialNumber(context);
        });
    }
}
