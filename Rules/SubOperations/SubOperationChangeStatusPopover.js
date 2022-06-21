import mobileStatusOverride from '../MobileStatus/MobileStatusUpdateOverride';
import common from '../Common/Library/CommonLibrary';
import {GlobalVar} from '../Common/Library/GlobalCommon';
import SubOperationMobileStatusLibrary from './MobileStatus/SubOperationMobileStatusLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function SubOperationChangeStatusPopover(context) {
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const REJECTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    const userGUID = common.getUserGuid(context);

    /**
     * Checks for started Work Orders or Operations. Work Order/Operation is inferred from context
     * @returns {Promise<Boolean>} whether or not any Work Orders/Operations are started by the current user, or if the user is clocked in
     */
     let startedCheck = function() {
        // Only check clock-in-clock-out/started count for work orders. For others, assume nothing started.
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}' and SubOpMobileStatus_Nav/CreateUserGUID eq '${userGUID}'`).then(results => {
            return results > 0;
        });
    };

    /**
     * Checks for supervisor feature enablement and returns role if applicable
     * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
     */
    let roleCheck = function() {
        const supervisorEnabled = (common.getAppParam(context, 'SUPERVISOR', 'Enable') === 'Y');
        const auth_supervisor = common.getAppParam(context, 'USER_AUTHORIZATIONS', 'SupervisorRole');
        const user = GlobalVar.getUserSystemInfo().get('PERNO');

        if (supervisorEnabled) {
            switch (auth_supervisor) {
                case 'Y': // Supervisor role set in config panel
                    return Promise.resolve('S');
                case 'N': // Technician role set in config panel
                    return Promise.resolve('T');
                default: // Role not set in config panel. Check data
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', [], `$filter=PersonnelNo eq '${user}'`).then(function(results) {
                        if (results && results.length > 0) {
                            return results.getItem(0).Role;
                        }
                        // If role cannot be found, assume supervisor
                        return 'S';
                    });
            }
        } else {
            // Supervisor isn't enabled
            return Promise.resolve('S');
        }
    };

    const assnType = common.getWorkOrderAssignmentType(context);
    // If operation level assignment, only allow confirm/unconfirm. Otherwise, do the whole mobile status shebang.
    if (assnType !== '3') {
        let operationMobileStatus = MobileStatusLibrary.getMobileStatus(context.binding.WorkOrderOperation, context);
        let headerMobileStatus = MobileStatusLibrary.getMobileStatus(context.binding.WorkOrderOperation.WOHeader, context);
        if (operationMobileStatus === STARTED || headerMobileStatus === STARTED) {
            return MobileStatusLibrary.isMobileStatusConfirmed(context, context.binding.SubOperationNo).then(result => {
                if (result) {
                    return SubOperationMobileStatusLibrary.unconfirmSubOperation(context);
                } else {
                    return SubOperationMobileStatusLibrary.completeSubOperation(context);
                }
            });
        }
        context.dismissActivityIndicator();
        return Promise.resolve();
    } else {
        return Promise.all([startedCheck(), roleCheck()]).then(checks => {
            const anythingStarted = checks[0];
            const supervisorRole = checks[1];
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], '$expand=NextOverallStatusCfg_Nav').then(codes => {
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
                    if (statusElement.MobileStatus === COMPLETE && element.RoleType === supervisorRole) {
                        // Prepend warning dialog to complete status change
                        popoverItems.push({'Title': transitionText, 'OnPress': {
                            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                            'Properties': {
                                'Title': context.localizeText('confirm_status_change'),
                                'Message': context.localizeText('complete_suboperation'),
                                'OKCaption': context.localizeText('ok'),
                                'CancelCaption': context.localizeText('cancel'),
                                'OnOK': mobileStatusOverride(context, statusElement, 'SubOpMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/SubOperationMobileStatusPostUpdate.js'),
                            },
                        }});
                    } else if (statusElement.MobileStatus === TRANSFER && element.RoleType === supervisorRole) {
                        // Prepend warning dialog to transfer status change
                        popoverItems.push({'Title': transitionText, 'OnPress': {
                            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                            'Properties': {
                                'Title': context.localizeText('confirm_status_change'),
                                'Message': context.localizeText('transfer_suboperation'),
                                'OKCaption': context.localizeText('ok'),
                                'CancelCaption': context.localizeText('cancel'),
                                'OnOK': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationTransferNav.action',
                            },
                        }});
                    } else {
                        // Add all other items to possible transitions as-is
                        // Omit Started if other work orders have been started
                        // Omit statuses not relevant to current role
                        if (!(statusElement.MobileStatus === STARTED && anythingStarted) && element.RoleType === supervisorRole) {
                            popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'SubOpMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/SubOperationMobileStatusPostUpdate.js')});
                        }
                    }
                });

                // Supervisor Mode: allow tech to back up to STARTED if work order is in REVIEW and status is local
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=MobileStatus eq '${STARTED}' and NextOverallStatusSeq_Nav/any(seq : seq/RoleType eq 'T') and ObjectType eq 'WO_OPERATION'`).then((results) => {
                    if (supervisorRole === 'T' && context.binding.SubOpMobileStatus_Nav.MobileStatus === REVIEW && results.length > 0 && context.binding.SubOpMobileStatus_Nav['@sap.isLocal']) {
                        popoverItems.push({'Title': results.getItem(0).TransitionTextKey, 'OnPress': mobileStatusOverride(context, results.getItem(0), 'SubOpMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/SubOperationMobileStatusPostUpdate.js')});
                    }

                    // Only build and show popover if there are multiple status transitions available
                    // Exception: Show popover with one item if role is supervisor and current status is REJECTED
                    if (popoverItems.length > 1 || (supervisorRole === 'S' && context.binding.SubOpMobileStatus_Nav.MobileStatus === REJECTED)) {
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
    }
}
