import libLocal from '../Common/Library/LocalizationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function CharacteristicLAMValuesCreateUpdateValidation(pageClientAPI) {

    var dict = {};
    libCom.getFieldValue(pageClientAPI, 'StartPoint', '', dict, true);
    libCom.getFieldValue(pageClientAPI, 'EndPoint', '', dict, true);
    libCom.getFieldValue(pageClientAPI, 'Length', '', dict, true);

    libCom.setInlineControlErrorVisibility(libCom.getControlProxy(pageClientAPI, 'StartPoint'), false);
    libCom.setInlineControlErrorVisibility(libCom.getControlProxy(pageClientAPI, 'EndPoint'), false);
    libCom.setInlineControlErrorVisibility(libCom.getControlProxy(pageClientAPI, 'Length'), false);

    libCom.getControlProxy(pageClientAPI, 'StartPoint').clearValidation();
    libCom.getControlProxy(pageClientAPI, 'EndPoint').clearValidation();
    libCom.getControlProxy(pageClientAPI, 'Length').clearValidation();

    let validations = [];

    validations.push(validateStartPointReadingIsNumeric(pageClientAPI, dict));
    validations.push(validateEndPointReadingIsNumeric(pageClientAPI, dict));
    validations.push(validateLengthIsPositive(pageClientAPI, dict));

    return Promise.all(validations).then(() => {
        return true;
    }).catch(() => {
        return false;
    });
}
    /**
     * Validate Length is positive
     */

    function validateLengthIsPositive(pageClientAPI, dict) {
        if (libLocal.toNumber(pageClientAPI, dict.Length) >= 0) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('negative_not_allowed');
            libCom.setInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'Length'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * Start Point reading must be numeric for decimal separator according to the device's local.
     */
    function validateStartPointReadingIsNumeric(pageClientAPI, dict) {

        if (libLocal.isNumber(pageClientAPI, dict.StartPoint)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('validation_reading_is_numeric');
            libCom.setInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'StartPoint'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * End Point reading must be numeric for decimal separator according to the device's local.
     */
    function validateEndPointReadingIsNumeric(pageClientAPI, dict) {

        if (libLocal.isNumber(pageClientAPI, dict.EndPoint)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('validation_reading_is_numeric');
            libCom.setInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'EndPoint'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }
