import libVal from '../../Common/Library/ValidationLibrary';

export default function SubEquipmentListViewOnPageLoad(context) {
    let equipId = context.binding.EquipId;
    var params = [];
    let queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    let totalCount = context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:SubEquipmentTotalCount');
    if (!libVal.evalIsEmpty(queryOption)) {
        if (queryOption.includes('$filter=') && !libVal.evalIsEmpty(queryOption.replace('$filter=',''))) {
            queryOption =  queryOption + `and SuperiorEquip eq '${equipId}'`;
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', queryOption).then(count => {
                params.push(count);
                params.push(totalCount);
                if (count === totalCount) {
                    return context.setCaption(context.localizeText('equipment_x', [context.formatNumber(totalCount)]));
                }
                return context.setCaption(context.localizeText('equipment_x_x', params));
            });
        }
    }
    return context.setCaption(context.localizeText('equipment_x', [context.formatNumber(totalCount)]));
}
