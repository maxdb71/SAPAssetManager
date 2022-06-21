import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderDetailsMainWorkCenter(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.MainWorkCenter) || libVal.evalIsEmpty(binding.WorkCenterInternalId)) {
        return '-';
    }

    let id = binding.MainWorkCenter;
    let filterQuery = `$filter=WorkCenterId eq '${binding.WorkCenterInternalId}' and ObjectType eq 'A'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            return id + ' - ' + result.getItem(0).WorkCenterDescr;
        }
        return id;
    });
}
