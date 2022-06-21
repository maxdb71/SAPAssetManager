import libOprMobile from './OperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function OperationStartStatus(context) {
	//Set ChangeStatus property to 'Started'.
	//ChangeStatus is used by OperationMobileStatusFailureMessage.action & OperationMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    return libOprMobile.startOperation(context).finally(() => {
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
}
