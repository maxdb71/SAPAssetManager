import mobileStatusOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import common from '../../Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from './OperationMobileStatusLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import isAssignEnableWorkOrderOperation from '../../Operations/MobileStatus/IsAssignEnableWorkOrderOperation';
import isUnAssignEnableWorkOrderOperation from '../../Operations/MobileStatus/IsUnAssignEnableWorkOrderOperation';


export default function OperationChangeStatusPopover(context) {
    const READY = 'READY'; // Don't bother adding this to the config panel. EAM Team needs to fix their hardcoded app transitions first. See TODO below.
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const REJECTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    const cicoEnabled = libClock.isCICOEnabled(context);

    /**
     * Checks for supervisor feature enablement and returns role if applicable
     * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
     */
     let roleCheck = function() {
        const eam_phase_model = (common.getAppParam(context, 'EAM_PHASE_MODEL', 'Enable') === 'Y');
        const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);

        if (eam_phase_model) {
            // If EAM_PHASE_MODEL is on, forget about supervisor
            return Promise.resolve('');
        } else if (supervisorEnabled) {
            return libSuper.isUserTechnician(context).then(isTechnician => {
                if (isTechnician) {
                    return 'T';
                }
                return 'S';
            });
        } else {
            // Supervisor isn't enabled
            return Promise.resolve('S');
        }
    };
    let startedCheck = OperationMobileStatusLibrary.isAnyOperationStarted(context);

    const assnType = common.getWorkOrderAssignmentType(context);
    // If header level assignment, only allow confirm/unconfirm. Otherwise, do the whole mobile status shebang.
    if (assnType === '1' || assnType === '5' || assnType === '7' || assnType === '8') {
        let workOrderMobileStatus = MobileStatusLibrary.getMobileStatus(context.binding.WOHeader, context);
        if (workOrderMobileStatus === STARTED) {
            return MobileStatusLibrary.isMobileStatusConfirmed(context).then(result => {
                if (result) {
                    return OperationMobileStatusLibrary.unconfirmOperation(context);
                } else {
                    return OperationMobileStatusLibrary.completeOperation(context);
                }
            });
        }
        context.dismissActivityIndicator();
        return Promise.resolve();
    } else {
        return Promise.all([startedCheck, roleCheck()]).then(checks => {
            const anythingStarted = checks[0];
            const supervisorRole = checks[1];
            const isClockedIn = libClock.isBusinessObjectClockedIn(context);

            // If CICO enabled, current Operation is started, and nothing is clocked in, do not transition; clock in immediately
            if (!anythingStarted && context.binding.OperationMobileStatus_Nav.MobileStatus === STARTED && (cicoEnabled && !isClockedIn)) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationDummyStatusToast.action'); //Need to run an action here, or MDK does not allow us to update toolbar caption
            } else {
                return libSuper.checkReviewRequired(context, context.binding).then(review => {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/OperationMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
                        common.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0)); //Save the rollback state to use if necessary
                        return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/OperationMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], '$expand=NextOverallStatusCfg_Nav').then(codes => {
                            let popoverItems = [];

                            // Go through each available next status and create a PopoverItems array
                            codes.forEach(element => {
                                let statusElement = element.NextOverallStatusCfg_Nav;
                                let transitionText;

                                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                                if (statusElement.TransitionTextKey) {
                                    transitionText = context.localizeText(statusElement.TransitionTextKey);
                                } else {
                                    transitionText = statusElement.OverallStatusLabel;
                                }

                                // Add items to possible transitions list
                                if (statusElement.MobileStatus === REJECTED && element.RoleType === supervisorRole) {
                                    common.setStateVariable(context, 'PhaseModelStatusElement', statusElement);
                                    popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js'});
                                } else if (statusElement.MobileStatus === REVIEW && element.RoleType === supervisorRole) {
                                    if (review) { //Review required for tech
                                        popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js')});
                                    }
                                } else if (statusElement.MobileStatus === COMPLETE && element.RoleType === supervisorRole && context.binding.OperationMobileStatus_Nav.MobileStatus === STARTED) { // Extra STARTED check because EAM team did an incorrect implementation
                                    if (!supervisorRole || supervisorRole === 'S' || (supervisorRole === 'T' && !review)) { //Allow complete if not using supervisor feature or supervisor or if technician and WO does not require review
                                        // Prepend warning dialog to complete status change
                                        popoverItems.push({'Title': transitionText, 'OnPress': {
                                            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                                            'Properties': {
                                                'Title': context.localizeText('confirm_status_change'),
                                                'Message': context.localizeText('complete_operation_warning_message'),
                                                'OKCaption': context.localizeText('ok'),
                                                'CancelCaption': context.localizeText('cancel'),
                                                'OnOK': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js'),
                                            },
                                        }});
                                    }
                                } else if (statusElement.MobileStatus === TRANSFER && element.RoleType === supervisorRole) {
                                    // Prepend warning dialog to transfer status change
                                    popoverItems.push({'Title': transitionText, 'OnPress': {
                                        'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                                        'Properties': {
                                            'Title': context.localizeText('confirm_status_change'),
                                            'Message': context.localizeText('transfer_operation_warning_message'),
                                            'OKCaption': context.localizeText('ok'),
                                            'CancelCaption': context.localizeText('cancel'),
                                            'OnOK': '/SAPAssetManager/Actions/WorkOrders/Operations/OperationTransferNav.action',
                                        },
                                    }});
                                } else {
                                    // Add all other items to possible transitions as-is
                                    // Omit Started if other work orders have been started
                                    // Omit statuses not relevant to current role

                                    // TODO: EAM Team currently has status changes hardcoded in "Perform Maintenance Jobs" app. Remove hardcoded conditionals once this changes.
                                    // Original code:
                                    // if (!(statusElement.MobileStatus === STARTED && anythingStarted) && element.RoleType === supervisorRole) {
                                    //     popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav')});
                                    // } else {
                                    //     // Do nothing
                                    // }
                                    if (common.getAppParam(context, 'EAM_PHASE_MODEL', 'Enable') === 'Y') {
                                        if ((context.binding.OperationMobileStatus_Nav.MobileStatus === READY && statusElement.MobileStatus === STARTED && !anythingStarted) ||
                                            (context.binding.OperationMobileStatus_Nav.MobileStatus === STARTED && statusElement.MobileStatus === HOLD) ||
                                            (context.binding.OperationMobileStatus_Nav.MobileStatus === HOLD && statusElement.MobileStatus === STARTED && !anythingStarted) ||
                                            (context.binding.OperationMobileStatus_Nav.MobileStatus === STARTED && statusElement.MobileStatus === COMPLETE)) {
                                                popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js')});
                                        } else {
                                            // Do nothing
                                        }
                                    } else if (!(statusElement.MobileStatus === STARTED && anythingStarted) && element.RoleType === supervisorRole) {
                                            popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js')});
                                    } else {
                                        // Do nothing
                                    }
                                }
                            });

                             //Add supervisor role assignment options (These are not data driven currently)
                            return Promise.all([isAssignEnableWorkOrderOperation(context), isUnAssignEnableWorkOrderOperation(context)]).then(assignResults => {
                                const assign = assignResults[0];
                                const unassign = assignResults[1];

                                if (assign) {
                                    popoverItems.push({'Title': '$(L,assign)', 'OnPress': '/SAPAssetManager/Rules/Supervisor/Assign/OperationAssignNav.js'});
                                }
                                if (unassign) {
                                    popoverItems.push({'Title': '$(L,unassign)', 'OnPress': '/SAPAssetManager/Rules/Supervisor/UnAssign/OperationUnAssignNav.js'});
                                    popoverItems.push({'Title': '$(L,reassign)', 'OnPress': '/SAPAssetManager/Rules/Supervisor/ReAssign/OperationReAssignNav.js'});
                                }
                                
                                // Only build and show popover if there are multiple status transitions available
                                if (popoverItems.length > 1 || (supervisorRole === 'S' && context.binding.OperationMobileStatus_Nav.MobileStatus === REJECTED)) {
                                    return context.executeAction({
                                        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusTransitionPopover.action',
                                        'Properties': {
                                            'PopoverItems' : popoverItems,
                                        },
                                    });
                                } else if (popoverItems.length === 1) {
                                    // If only one status transition is available, immediately execute that action instead of showing a popover
                                    return context.executeAction(popoverItems[0].OnPress);
                                } else {
                                    return Promise.resolve();
                                }
                            });
                        });
                    });
                });
            }
        });
    }
}
