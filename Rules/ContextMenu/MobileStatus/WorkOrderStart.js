import common from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import mobilestatus from '../../MobileStatus/MobileStatusLibrary';
import {guid} from '../../Common/guid';
import ChangeMobileStatus from './ChangeMobileStatus';
/**
* Starts a Work Order and clocks it in
* @param {IClientAPI} context
*/
export default function WorkOrderStart(context) {
	let binding = context.binding;
	if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
	
	//Set ChangeStatus to 'start'.
	//ChangeStatus is used by WorkOrderMobileStatusFailureMessage.action & WorkOrderMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

	const START_STATUS = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
	const HOLD_STATUS = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

    if (mobilestatus.isHeaderStatusChangeable(context)) {
		// Generate start time; save in app data
		let odataDate = new ODataDate();
		common.setStateVariable(context, 'StatusStartDate', odataDate.date());
		// Get Object Key
		let ObjectKey = (function() {
			if (binding.ObjectKey) {
				return binding.ObjectKey;
			} else if (binding.OrderMobileStatus_Nav.ObjectKey) {
				return binding.OrderMobileStatus_Nav.ObjectKey;
			} else {
				return '';
			}
		})();
		// Get Object Type
		let ObjectType = common.getAppParam(context,'OBJECTTYPE','WorkOrder');
		// Get Effective Timestamp
		let EffectiveTimestamp = odataDate.toDBDateTimeString(context);
		// Get user GUID
		let UserGUID = common.getUserGuid(context);
        //Get user name
        let UserId = common.getSapUserName(context);
		// Get ReadLink
		let ReadLink = (function() {
			if (binding.OrderMobileStatus_Nav) {
				return binding.OrderMobileStatus_Nav['@odata.readLink'];
			}
			return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/OrderMobileStatus_Nav', [], '').then(function(result) {
				return result.getItem(0)['@odata.readLink'];
			});
		})();

		// If mobile status is already started (by someone else) put a hold in first
		let holdStatus = Promise.resolve();

		if (binding.OrderMobileStatus_Nav.MobileStatus === START_STATUS) {
			holdStatus = ChangeMobileStatus(context, ObjectKey, ObjectType, HOLD_STATUS, EffectiveTimestamp, UserGUID, ReadLink, UserId);
		}
		// Run mobile status update
		return holdStatus.then(() => {
			return ChangeMobileStatus(context, ObjectKey, ObjectType, START_STATUS, EffectiveTimestamp, UserGUID, ReadLink, UserId);
		}).then(() => {
			// Run CICO update
			return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
				'Properties': {
					'RecordId': guid(),
					'UserGUID': UserGUID,
					'OperationNo': '',
					'SubOperationNo': '',
					'OrderId': binding.OrderId,
					'PreferenceGroup': common.getAppParam(context,'CICO','Enable') === 'Y' ? 'CLOCK_IN' : 'START_TIME',
					'PreferenceName': binding.OrderId,
					'PreferenceValue': EffectiveTimestamp,
                    'UserId': UserId,
				},
				'Headers': {
					'OfflineOData.RemoveAfterUpload': 'false',
				},
				'CreateLinks': [{
					'Property': 'WOHeader_Nav',
					'Target':
					{
						'EntitySet': 'MyWorkOrderHeaders',
						'ReadLink': "MyWorkOrderHeaders('" + binding.OrderId + "')",
					},
				}],
			}});
		}).then(() => {
			// Start Work Order succeeded. Show a message.
			return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action');
		}).catch(() => {
			// Something failed. Show a message.
			return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
		}).finally(() => {
            delete context.getPageProxy().getClientData().ChangeStatus;     
        });
	} else {
		return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').finally(() => {
            delete context.getPageProxy().getClientData().ChangeStatus;     
        });
	}
}
