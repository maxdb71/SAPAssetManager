/**
* Show/Hide Work Order create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableWorkOrderCreate(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Create') === 'Y');
}
