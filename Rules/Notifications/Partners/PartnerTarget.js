import NotificationTypeLstPkrDefault from '../NotificationTypePkrDefault';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerTarget(context) {
	return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${NotificationTypeLstPkrDefault(context)}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(result => {
        if (result.length > 0) {
			let idx = 0;
			if (context.getName() === 'PartnerPicker2' && result.length > 1) {
				idx = 1;
			} else if (context.getName() === 'PartnerPicker2' && !(result.length > 1)) {
				return [];
			}
			let type = result.getItem(idx).PartnerFunction_Nav.PartnerFunction;

			let displayValue = '';
			let returnValue = '';
			let entitySet = '';

			let out = [];

			switch (type) {
				case 'SP':
					displayValue = 'Name1';
					returnValue = 'Customer';
					entitySet = 'Customers';
					break;
				case 'VN':
					displayValue = 'Name1';
					returnValue = 'Vendor';
					entitySet = 'Vendors';
					break;
				case 'AO':
				case 'KU':
				case 'VU':
					displayValue = 'UserName';
					returnValue = 'UserId';
					entitySet = 'SAPUsers';
					break;
				case 'VW':
					displayValue = 'EmployeeName';
					returnValue = 'PersonnelNumber';
					entitySet = 'Employees';
					break;
				default:
					return out;
			}

			return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then(entries => {
				for (let i = 0; i < entries.length; i ++) {
					out.push({'DisplayValue' : entries.getItem(i)[displayValue] || '-', 'ReturnValue' : entries.getItem(i)[returnValue]});
				}
				return out;
			});
		} else {
			return [];
		}
    });
}
