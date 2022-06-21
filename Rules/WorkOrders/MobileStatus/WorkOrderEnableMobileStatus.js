import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function WorkOrderEnableMobileStatus(context) {

    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
        if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
            return Promise.resolve(false);
        }
    }

    if (libMobile.isHeaderStatusChangeable(context)) {
        var woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        var woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        var review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        var rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        var mobileStatus = libMobile.getMobileStatus(context.binding, context);
        var sapUserName = libCommon.getSapUserName(context);

        //User may be clocked in to this WO regardless of what mobile status is set to, so allow change
        //Status may have been changed by another user, so trap that here
        if (libClock.isBusinessObjectClockedIn(context)) {
            return Promise.resolve(true);
        }
        return libSuper.isBusinessObjectEditable(context).then(editable => {
            if (!editable) {
                return false; //Supervisor is enabled, user is a tech, work center assignments and this work order is not assigned to this user
            }
            return libClock.isUserClockedIn(context).then(clockedIn => {
                if (mobileStatus === woTransfer || mobileStatus === woComplete) {
                    return false;
                } else if (mobileStatus === woStarted) {
                    if (libClock.isCICOEnabled(context)) {
                        //I am either not clocked in (so allow starting this WO that somebody else started), or the status change was made by me
                        if (!clockedIn || context.binding.ClockSapUserName === sapUserName) {
                            return true;
                        }
                        return false;
                    } else { //Clock in/out is disabled
                        return true;
                    }
                } else if (mobileStatus === review) {
                    return libSuper.isUserSupervisor(context).then(isSupervisor => {
                        if (isSupervisor) { //Supervisor can approve
                            return true;
                        }
                        if (libSuper.isSupervisorFeatureEnabled(context)) {
                            if (context.binding.supervisorLocal) { //Tech can re-open a local review status object
                                return true;
                            }
                        }
                        return false; //Review status has been transmitted, or feature not enabled so cannot edit
                    });
                } else if (mobileStatus === rejected) {
                    return libSuper.isUserSupervisor(context).then(isSupervisor => {
                        if (isSupervisor) {
                            if (context.binding.supervisorLocal) { //Supervisor can approve a local rejection status before transmit
                                return true;
                            }
                            return false;
                        }
                        if (libSuper.isSupervisorFeatureEnabled(context)) {
                            return true; //Tech can start and correct
                        }
                        return false; //Feature not enabled so cannot edit
                    });
                } else {
                    let isAnyOtherWorkOrderStartedPromise = libWOMobile.isAnyWorkOrderStarted(context);
                    return isAnyOtherWorkOrderStartedPromise.then(isAnyWorkOrderStarted => {
                        if (isAnyWorkOrderStarted && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
            });
        });
    }
    return Promise.resolve(false);
}
