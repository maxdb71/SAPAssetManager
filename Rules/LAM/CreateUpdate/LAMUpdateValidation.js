import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function LAMUpdatevalidation(context) {
    var dict = libCom.getControlDictionaryFromPage(context);
    libCom.setInlineControlErrorVisibility(dict.LRPLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.StartPoint, false);
    libCom.setInlineControlErrorVisibility(dict.Length, false);
    libCom.setInlineControlErrorVisibility(dict.UOMLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.StartMarkerLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.DistanceFromStart, false);
    libCom.setInlineControlErrorVisibility(dict.EndMarkerLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.DistanceFromEnd, false);
    libCom.setInlineControlErrorVisibility(dict.MarkerUOMLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.Offset1TypeLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.Offset1, false);
    libCom.setInlineControlErrorVisibility(dict.Offset1UOMLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.Offset2TypeLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.Offset2, false);
    libCom.setInlineControlErrorVisibility(dict.Offset2UOMLstPkr, false);

    let validations = [];

    validations.push(validateStartPointReadingIsNumeric(context, dict));
    validations.push(validateEndPointReadingIsNumeric(context, dict));
    validations.push(validateLengthIsPositive(context, dict));
    validations.push(validateOffsets(context, dict));
    validations.push(validateRequiredField(context, dict.UOMLstPkr));
    if (dict.MarkerUOMLstPkr._control.observable().builder.builtData.IsEditable === true)
        validations.push(validateRequiredField(context, dict.MarkerUOMLstPkr));
    if (libCom.isDefined(dict.Offset1.getValue())) {
        validations.push(validateRequiredField(context, dict.Offset1TypeLstPkr));
    }
    if (libCom.isDefined(dict.Offset2.getValue())) {
        validations.push(validateRequiredField(context, dict.Offset2TypeLstPkr));
    }

    return Promise.all(validations).then(() => {
        return true;
    }).catch(() => {
        context.getControl('FormCellContainer').redraw();
        return false;
    });

}

    /**
     * Validate Length is positive
     */

    function validateLengthIsPositive(context, dict) {
        if (libLocal.toNumber(context, dict.Length.getValue()) >= 0) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('negative_not_allowed');
            libCom.setInlineControlError(context, libCom.getControlProxy(context, 'Length'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * Start Point reading must be numeric for decimal separator according to the device's local.
     */
    function validateStartPointReadingIsNumeric(context, dict) {

        if (libLocal.isNumber(context, dict.StartPoint.getValue())) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('validation_reading_is_numeric');
            libCom.setInlineControlError(context, libCom.getControlProxy(context, 'StartPoint'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * End Point reading must be numeric for decimal separator according to the device's local.
     */
    function validateEndPointReadingIsNumeric(context, dict) {

        if (libLocal.isNumber(context, dict.EndPoint.getValue())) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('validation_reading_is_numeric');
            libCom.setInlineControlError(context, libCom.getControlProxy(context, 'EndPoint'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }
    /**
     * Check UOM for each picker
     * @param {*} context
     * @param {*} control
     */
    function validateRequiredField(context,control) {
        if (!libCom.isDefined(control.getValue())) {
            let message = context.localizeText('field_is_required');
            libCom.setInlineControlError(context, control, message);
            return Promise.reject();
        } else {
            return Promise.resolve(true);
        }

    }

    function validateOffsets(context, dict) {
        ///Check pickers that pickers have a value. Resolve promise if both are empty. If not verify that are types are different
        if (libCom.isDefined(dict.Offset1TypeLstPkr.getValue()) && libCom.isDefined(dict.Offset2TypeLstPkr.getValue())) {
            //Offset types must be different
            if (dict.Offset1TypeLstPkr.getValue()[0].ReturnValue === dict.Offset2TypeLstPkr.getValue()[0].ReturnValue) {
            let message = context.localizeText('validation_offsets_types_are_same');
            libCom.setInlineControlError(context, dict.Offset1TypeLstPkr, message);
            libCom.setInlineControlError(context, dict.Offset2TypeLstPkr, message);
            dict.InlineErrorsExist = true;
            return Promise.reject();
            } else {
                ///Check offsets are numeric
                if (libLocal.isNumber(context, dict.Offset1.getValue()) && libLocal.isNumber(context, dict.Offset2.getValue())) {
                    return Promise.resolve(true);
                } else {
                    let message = context.localizeText('validation_reading_is_numeric');
                    libCom.setInlineControlError(context, dict.Offset1, message);
                    libCom.setInlineControlError(context, dict.Offset2, message);
                    return Promise.reject();
                }
            }
        } else {
            return Promise.resolve(true);
        }
    }
