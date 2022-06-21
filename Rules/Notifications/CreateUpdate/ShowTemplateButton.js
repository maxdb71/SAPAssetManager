import common from '../../Common/Library/CommonLibrary';

/**
* Show/hide "Use Template" button
* @param {IClientAPI} context
*/
export default function ShowTemplateButton(context) {
	return common.IsOnCreate(context) && common.getAppParam(context, 'EAM_PHASE_MODEL', 'Enable') === 'Y';
}
