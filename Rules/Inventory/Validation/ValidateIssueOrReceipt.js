import libCom from '../../Common/Library/CommonLibrary';
import showBatch from './ShowMaterialBatchField';
import showAuto from './ShowAutoSerialNumberField';
import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';

export default function ValidateIssueOrReceipt(context) {

    var dict = libCom.getControlDictionaryFromPage(context);

    dict.QuantitySimple.clearValidation();
    dict.MatrialListPicker.clearValidation();
    dict.StorageLocationPicker.clearValidation();
    dict.MovementTypePicker.clearValidation();
    dict.BatchSimple.clearValidation();
    dict.AutoSerialNumberSwitch.clearValidation();
    dict.SerialNumListText.clearValidation();
    context.getControl('FormCellContainer').redraw();
    
    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict));
    validations.push(validatePrecisionWithinLimit(context, dict));
    validations.push(validateMaterialNotBlank(context, dict));
    validations.push(validateStorageLocationNotBlank(context, dict));
    validations.push(validateMovePlantNotBlank(context, dict));
    validations.push(validateMoveStorageLocationNotBlank(context, dict));
    validations.push(validateMovementTypeNotBlank(context, dict));
    validations.push(validateQuantityIsValid(context, dict));
    validations.push(validateBatchNotBlank(context, dict));
    validations.push(validateBatchToNotBlank(context, dict));
    validations.push(validateAutoSerialNotBlank(context, dict));
    //validations.push(validateSerialNumListPickerNotBlank(context, dict));
    validations.push(validateSerialNumListTextNotBlank(context, dict));
    validations.push(validateCostCenterNotBlank(context, dict));
    validations.push(validateCostCenterNotBlank(context, dict));
    validations.push(validateWBSElementNotBlank(context, dict));
    validations.push(validateOrderNotBlank(context, dict));
    validations.push(validateNetworkNotBlank(context, dict));
    validations.push(validateActivityNotBlank(context, dict));

    return Promise.all(validations).then(function() {
        return Promise.resolve(true);
    }).catch(function() {
        // Errors exist
        context.getControl('FormCellContainer').redraw();
        return Promise.resolve(false);
    });
}

/**
 * Quantity must be > 0
 */
function validateQuantityGreaterThanZero(context, dict) {
    if (libLocal.toNumber(context, dict.QuantitySimple.getValue()) > 0) {
        return Promise.resolve(true);
    } 
    let message = context.localizeText('quantity_must_be_greater_than_zero');
    libCom.setInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}

/**
 * Material cannot be blank
 */
function validateMaterialNotBlank(context, dict) {
    if ((!(libCom.getPreviousPageName(context) === 'StockDetailsPage')) && showMaterialTransferToFields(context)) {
        if (libCom.getListPickerValue(dict.MatrialListPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.MatrialListPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Move Plant cannot be blank
 */
function validateMovePlantNotBlank(context, dict) {
    if (showMaterialTransferToFields(context)) {
        if (libCom.getListPickerValue(dict.PlantToListPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.PlantToListPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Move Storage Location cannot be blank
 */
 function validateMoveStorageLocationNotBlank(context, dict) {
    if (showMaterialTransferToFields(context)) {
        if (libCom.getListPickerValue(dict.StorageLocationToListPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.StorageLocationToListPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Storage Location cannot be blank
 */
 function validateStorageLocationNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.StorageLocationPicker.getValue())) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('field_is_required');
    libCom.setInlineControlError(context, dict.StorageLocationPicker, message);
    return Promise.reject();
}

/**
 * Movement Type cannot be blank
 */
 function validateMovementTypeNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.MovementTypePicker.getValue())) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('field_is_required');
    libCom.setInlineControlError(context, dict.MovementTypePicker, message);
    return Promise.reject();
}

/**
 * 
 * Quantity cannot be greater than open
 */
function validateQuantityIsValid(context, dict) {
    let qty = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let open;
    let openRequired = false;
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (context.binding) {
        let binding = context.binding;
        if (type === 'PO') {
            open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
            openRequired = true;
        } else if (type === 'STO') {
            if (move === 'R') { //Receipt
                open = Number(binding.TempItem_IssuedQuantity) - Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_OldQuantity);
            } else { //Issue
                open = Number(binding.TempItem_OrderQuantity) - Number(binding.TempItem_IssuedQuantity) + Number(binding.TempLine_OldQuantity);
            }
            openRequired = true;
        } else if (type === 'RES') {
            open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
            openRequired = true;
        }
    }
    if (qty <= open || !openRequired) {
        return Promise.resolve(true);
    }
    
    let message = context.localizeText('po_item_receiving_quantity_failed_validation_message',[open]);
    libCom.setInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}

/**
 * 
 * Check that batch is provided when material is batch enabled
 */
function validateBatchNotBlank(context, dict) {
    return showBatch(context).then(function(show) {
        if (!show || (show && dict.BatchSimple.getValue())) {
            return Promise.resolve(true); //Not batch enabled or batch enabled and provided
        }
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.BatchSimple, message);
        return Promise.reject();
    });
}

/**
 * 
 * Check that batch to is provided when material is batch enabled
 */
 function validateBatchToNotBlank(context, dict) {
    return showBatch(context).then(function(show) {
        if (!show || !showMaterialTransferToFields(context) || (show && dict.BatchNumTo.getValue())) {
            return Promise.resolve(true); //Not batch enabled or batch enabled and provided
        }
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.BatchNumTo, message);
        return Promise.reject();
    });
}

/**
 * 
 * Check that auto serial is provided when material is serialized
 */
function validateAutoSerialNotBlank(context, dict) {
    return showAuto(context).then(function(show) {
        let serialNumbers = dict.SerialNumListText.getValue();
        if (!serialNumbers) {
            serialNumbers = [];
        }
        if (!show || (show && dict.AutoSerialNumberSwitch.getValue())) {
            return Promise.resolve(true); //Not serialized or serialized and true
        } else if (serialNumbers.length > 0) {
            return Promise.resolve(true); 
        }

        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.AutoSerialNumberSwitch, message);
        return Promise.reject();
    });
}

/**
 * 
 * Check that at least one serial number has been entered for a serialized material
 */
 function validateSerialNumListTextNotBlank(context, dict) {
    return showAuto(context).then(function(show) {
        let serialNumbers = dict.SerialNumListText.getValue();
        if (!serialNumbers) {
            serialNumbers = [];
        }
        if (!show || (show && dict.AutoSerialNumberSwitch.getValue())) {
            return Promise.resolve(true);
        } else if (serialNumbers.length > 0) {
            return Promise.resolve(true); 
        }

        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.SerialNumListText, message);
        return Promise.reject();
    });
}

/**
 * 
 * Check that cost center is provided based on movement type 
 */
function validateCostCenterNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if ((movementTypeValue === '201' || movementTypeValue === '261') && !dict.CostCenterSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.CostCenterSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that WBS element is provided based on movement type 
 */
function validateWBSElementNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '221' && !dict.WBSElementSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.WBSElementSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that order is provided based on movement type 
 */
function validateOrderNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '261' && !dict.OrderSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.OrderSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that network is provided based on movement type 
 */
function validateNetworkNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '281' && !dict.NetworkSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.NetworkSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that activity is provided based on movement type 
 */
function validateActivityNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '281' && !dict.ActivitySimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.setInlineControlError(context, dict.ActivitySimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * quantity decimal precision must be within limits
 */
function validatePrecisionWithinLimit(context, dict) {

    let num = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let target = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    if (target < 0) {
        target = 0;
    }

    //Did user provide allowed decimal precision for quantity?
    if (Number(libMeasure.evalPrecision(num) > target)) {
        let message;
        if (target > 0) {
            let dynamicParams = [target];
            message = context.localizeText('quantity_decimal_precision_of',dynamicParams);
        } else {
            message = context.localizeText('quantity_integer_without_decimal_precision');
        }
        libCom.setInlineControlError(context, dict.QuantitySimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}
