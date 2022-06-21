import common from '../../Common/Library/CommonLibrary';

export default function NotificationHistoryLinks(context) {
    var links = [{
        'Property': 'HistoryPriority_Nav',
        'Target':
        {
            'EntitySet': 'Priorities',
            'ReadLink': `Priorities(PriorityType='${context.binding.PriorityType}',Priority='${context.evaluateTargetPath('#Control:PrioritySeg/#Value/#First/#Property:ReturnValue')}')`,
        },
    }];

    var flocValue = common.getTargetPathValue(context, '#Control:FuncLocHierarchyExtensionControl/#Value');
    var equipmentValue = common.getTargetPathValue(context, '#Control:EquipHierarchyExtensionControl/#Value');
    if (equipmentValue) {
        links.push({
            'Property': 'Equipment_Nav',
            'Target':
            {
                'EntitySet': 'MyEquipments',
                'ReadLink': `MyEquipments('${equipmentValue}')`,
            },
        });
    } else if (flocValue) {
        links.push({
            'Property': 'FuncLoc_Nav',
            'Target':
            {
                'EntitySet': 'MyFunctionalLocations',
                'ReadLink': `MyFunctionalLocations('${flocValue}')`,
            },
        });
    }
    return links;
}
