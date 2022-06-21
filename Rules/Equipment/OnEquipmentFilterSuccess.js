import libVal from '../Common/Library/ValidationLibrary';
import EquipEntity from './EquipmentEntitySet';
import EquipQuery from './EquipmentQueryOptions';


export default function OnEquipmentFilterSuccess(context) {
    let queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    var params = [];
    let totalCount = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:EquipmentTotalCount');
    let entitySet = EquipEntity(context);
    if (!libVal.evalIsEmpty(EquipQuery(context))) {
        if (EquipQuery(context).includes('$filter=')) {
            if (queryOption.includes('$filter=') && !libVal.evalIsEmpty(queryOption.replace('$filter=',''))) {
                queryOption = queryOption + ' and ' + '('+ EquipQuery(context).replace('$filter=','')+')' ;
            } else {
                queryOption = EquipQuery(context) + '&'+ queryOption;
            }
        } else {
            queryOption = EquipQuery(context) + '&'+ queryOption;
        }
    }
    return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet,queryOption).then(count => {
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('equipment_x', [context.formatNumber(totalCount)]));
        }
        return context.setCaption(context.localizeText('equipment_x_x', params));
    });
}
