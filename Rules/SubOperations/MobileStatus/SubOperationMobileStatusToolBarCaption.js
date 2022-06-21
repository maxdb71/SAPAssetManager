import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libSubOPMobile from './SubOperationMobileStatusLibrary';

export default function SubOperationMobileStatusToolBarCaption(context) {
    let received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    let hold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    let started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let transfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    let complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let mobileStatus = libMobile.getMobileStatus(context.binding, context);

    //Change sub-operation status when assignment type is at sub-operation level.
    if (libMobile.isSubOperationStatusChangeable(context)) {

        if (mobileStatus === received || mobileStatus === hold) {
            //This sub-operation is not started. It is currently either on hold or received status.
            let isAnyOtherSubOperationStartedPromise = libSubOPMobile.isAnySubOperationStarted(context);
            return isAnyOtherSubOperationStartedPromise.then(
                isAnyOtherOperationStarted => {
                    if (isAnyOtherOperationStarted) {
                        return context.localizeText('transfer');
                    } else {
                        return context.localizeText('start_suboperation');
                    }
                }
            );
        } else if (mobileStatus === started) {
            return Promise.resolve(context.localizeText('end_suboperation'));
        } else if (mobileStatus === transfer) {
            return Promise.resolve(context.localizeText('transferred'));
        } else if (mobileStatus === complete) {
            return Promise.resolve(context.localizeText('completed'));
        }
        return Promise.resolve(context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/Status.global').getValue());
    } else {
        //Change sub-operation status for all other assignment types.
        return libMobile.isMobileStatusConfirmed(context, context.binding.SubOperationNo).then(result => {
            if (result) {
                return context.localizeText('unconfirm');
            } else {
                return context.localizeText('confirm');
            }
        });
    }
}
