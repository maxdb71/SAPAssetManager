import notification from '../NotificationLibrary';

/**
* Update Part Group, Damage Group, and Cause Group pickers
* after Type, FLOC, or Equipment changes
* @param {IClientAPI} context
*/
export default function UpdateGroupPickers(context) {
	let partGroupQuery = notification.NotificationTaskActivityGroupQuery(context.getPageProxy(), 'CatTypeObjectParts');
	let damageGroupQuery = notification.NotificationTaskActivityGroupQuery(context.getPageProxy(), 'CatTypeDefects');
	let causeGroupQuery = notification.NotificationTaskActivityGroupQuery(context.getPageProxy(), 'CatTypeCauses');

	return Promise.all([partGroupQuery, damageGroupQuery, causeGroupQuery]).then(queryOpts => {
		// Set Part Group Query Options
		let partGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:PartGroupLstPkr');
		let partGroupSpecifier = partGroupPicker.getTargetSpecifier();
		partGroupSpecifier.setQueryOptions(queryOpts[0]);
		partGroupPicker.setTargetSpecifier(partGroupSpecifier);

		// Set Damage Group Query Options
		let damageGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:DamageGroupLstPkr');
		let damageGroupSpecifier = damageGroupPicker.getTargetSpecifier();
		damageGroupSpecifier.setQueryOptions(queryOpts[1]);
		damageGroupPicker.setTargetSpecifier(damageGroupSpecifier);

		// Set Cause Group Query Options
		let causeGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:CauseGroupLstPkr');
		let causeGroupSpecifier = causeGroupPicker.getTargetSpecifier();
		causeGroupSpecifier.setQueryOptions(queryOpts[2]);
		causeGroupPicker.setTargetSpecifier(causeGroupSpecifier);
	});
}
