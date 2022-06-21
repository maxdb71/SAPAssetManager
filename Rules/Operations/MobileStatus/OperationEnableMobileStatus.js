import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libOPMobile from './OperationMobileStatusLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function OperationEnableMobileStatus(context) {

    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
        if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
            return false;
        }
    }

    var started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    if (libMobile.isHeaderStatusChangeable(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.WOHeader['@odata.readLink'], [], '$expand=OrderMobileStatus_Nav').then(function(result) {
            if (result && result.length > 0) {
                let headerMobileStatus = libMobile.getMobileStatus(result.getItem(0), context);
                return headerMobileStatus === started;
            } else {
                return false;
            }
        });
    }

    if (libMobile.isOperationStatusChangeable(context)) {
        let mobileStatus = libMobile.getMobileStatus(context.binding, context);
        var transfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        var complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        var review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        var rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        var sapUserName = libCommon.getSapUserName(context);

        //User may be clocked in to this operation regardless of what mobile status is set to, so allow change
        //Status may have been changed by another user, so trap that here
        if (libClock.isBusinessObjectClockedIn(context) &&  mobileStatus !== complete) {
            return true;
        }
        return libSuper.isBusinessObjectEditable(context).then(editable => {
            if (!editable) {
                return false; //Supervisor is enabled, user is a tech, work center assignments and this operation is not assigned to this user
            }
            return libClock.isUserClockedIn(context).then(clockedIn => {
                if (mobileStatus === transfer || mobileStatus === complete) {
                    return false;
                } else if (mobileStatus === started) {
                    if (libClock.isCICOEnabled(context)) {
                        //Started, but I am either not clocked in, or clocked in and this operation was started by me
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
                    let isAnyOtherWorkOrderStartedPromise = libOPMobile.isAnyOperationStarted(context);
                    return isAnyOtherWorkOrderStartedPromise.then(isAnyOperationStarted => {
                        return !isAnyOperationStarted;
                    });
                }
            });
        });
    }
    return false;
}
