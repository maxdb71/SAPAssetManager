
export default function PriorityFilter(context) {

    var priorityObj = {name: 'Priority', values: []};
    var priorities = [];
   
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '$orderby=Priority').then(function(data) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let priority = data.getItem(i);
                let returnValue = priority.Priority;
                let displayValue = priority.PriorityDescription;
                let obj = {ReturnValue: returnValue, DisplayValue: displayValue};
                if (!priorities.includes(displayValue)) {
                    priorities.push(displayValue);
                    priorityObj.values.push(obj);
                }
            }
        }
        return priorityObj; 
    }, function() {
        return {name: 'Failed', values: []};
    });

}
