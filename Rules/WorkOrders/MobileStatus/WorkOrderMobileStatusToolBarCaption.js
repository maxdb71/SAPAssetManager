import libWOMobile from './WorkOrderMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function WorkOrderMobileStatusToolBarCaption(context) {
    var woReceived = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    var woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    var woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    var woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());

    return libWOMobile.headerMobileStatus(context).then((mobileStatus) => {
        //User may be clocked in to this WO locally regardless of what mobile status is set to
        //Status may have been changed by another user, so trap that here
        if (libClock.isBusinessObjectClockedIn(context)) {
            return Promise.resolve(context.localizeText('clock_out'));
        } else {
            if (mobileStatus === woReceived || mobileStatus === woHold) {
                //This order is not started. It is currently either on hold or received status.
                let isAnyOtherWorkOrderStartedPromise = libWOMobile.isAnyWorkOrderStarted(context);
                return isAnyOtherWorkOrderStartedPromise.then(
                    isAnyWorkOrderStarted => {
                        if (isAnyWorkOrderStarted) {
                            return Promise.resolve(context.localizeText('transfer'));
                        } else {
                            if (libClock.isCICOEnabled(context)) {
                                return Promise.resolve(context.localizeText('clock_in'));
                            } else {
                                return Promise.resolve(context.localizeText('start_workorder'));
                            }
                        }
                    }
                );
            } else if (mobileStatus === woStarted) {
                if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                    if (context.binding.ClockSapUserName === libCommon.getSapUserName(context)) {
                        return Promise.resolve(context.localizeText('clock_out')); //This WO status was last changed by me
                    } else {
                        return Promise.resolve(context.localizeText('clock_in')); //This work order was started by someone else, so current user can also start it
                    }
                } else {
                    return Promise.resolve(context.localizeText('end_workorder'));
                }
            } else if (mobileStatus === woTransfer) {
                return Promise.resolve(context.localizeText('transferred'));
            } else if (mobileStatus === woComplete) {
                return Promise.resolve(context.localizeText('completed'));
            } else if (mobileStatus === review) {
                return libSuper.isUserSupervisor(context).then(result => {
                    if (result) { //Supervisor has approve/reject option
                        return Promise.resolve(context.localizeText('review_text'));
                    }
                    return Promise.resolve(context.localizeText('restart_workorder'));
                });
            } else if (mobileStatus === rejected) {
                return libSuper.isUserSupervisor(context).then(result => {
                    if (result) {
                        return Promise.resolve(context.localizeText('edit_review')); //Supervisor can edit any review
                    }
                    let isAnyOtherWorkOrderStartedPromise = libWOMobile.isAnyWorkOrderStarted(context);
                    return isAnyOtherWorkOrderStartedPromise.then(isAnyWorkOrderStarted => { //Tech will see the start or transfer option
                        if (isAnyWorkOrderStarted) {
                            return Promise.resolve(context.localizeText('transfer'));
                        } else {
                            if (libClock.isCICOEnabled(context)) {
                                return Promise.resolve(context.localizeText('clock_in'));
                            } else {
                                return Promise.resolve(context.localizeText('start_workorder'));
                            }
                        }
                    });
                });
            }
        }
        return Promise.resolve(context.localizeText(mobileStatus));
    }).catch(() => {
        return Promise.resolve(context.localizeText('status'));
    });

}
