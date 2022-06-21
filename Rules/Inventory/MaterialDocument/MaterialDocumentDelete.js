import libCom from '../../Common/Library/CommonLibrary';
import updateItem from '../MaterialDocumentItem/UpdateInventoryDuringMatDocItemDelete';

export default function MaterialDocumentDelete(context) {

    libCom.setStateVariable(context, 'TempInventoryMaterialDocumentDelete', true);
    //Read all lines that are able to be received
    let query = "$filter=MaterialDocNumber eq '" + context.binding.MaterialDocNumber + "' and MaterialDocYear eq '" + context.binding.MaterialDocYear + "'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MatDocItem'], query).then(function(results) {
        if (results && results.length > 0) {
            var itemArray = [];
            results.forEach(function(row) {
                itemArray.push(row);
            });
            return ProcessItemLoop(context, itemArray).then(() => {
                libCom.removeStateVariable(context, 'TempInventoryMaterialDocumentDelete');
                context.binding.TempHeader_MatDocReadLink = context.binding['@odata.readLink'];
                //Delete material document header
                return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDeleteDuringItemDelete.action').then(() => {
                    //Close mat doc edit, mat doc details screens
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                    });
                });
            });
        }
        return false; //No lines (should never happen)
    });
}

//Loop over material document items and update the inventory quantities
export function ProcessItemLoop(context, items) {

    let row = items[0];

    //Update the inventory item counts tied to this mat doc item
    return updateItem(context, row).then(() => {  
        //Continue looping
        items.shift(); //Drop the first row in the array
        if (items.length > 0) {
            return ProcessItemLoop(context, items); //Recursively process the next item
        }
        return Promise.resolve(true); //No more items
    });
}
