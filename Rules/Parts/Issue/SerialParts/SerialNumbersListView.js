import issuedSerialNumberQuery from './SerialNumbersIssuedQuery';


/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SerialNumbersListView(context) {

    return issuedSerialNumberQuery(context).then((serialNumsArray) => {
        if (serialNumsArray && serialNumsArray.length > 0) {
            let binding = context.binding;
            binding.SerialNumsArray = serialNumsArray;
            context.getPageProxy().setActionBinding(binding);
        }
        return context.executeAction('/SAPAssetManager/Actions/Parts/SerialPartsListViewNav.action');  
    });
}
