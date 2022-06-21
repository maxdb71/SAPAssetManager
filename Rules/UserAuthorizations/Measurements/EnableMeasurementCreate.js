/**
* Show/Hide Take Reading button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableMeasurementCreate(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y');
}
