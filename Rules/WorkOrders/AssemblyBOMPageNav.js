import Logger from '../Log/Logger';

export default function AssemblyBOMPageNav(context) {
    let filterQuery = `$expand=MaterialBOM_Nav&$filter=MaterialNum eq '${context.binding.Assembly}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], filterQuery).then(function(result) {
       if (result && result.length > 0) {
           let binding = result.getItem(0);
           return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialBOMs', [], `$expand=BOMHeader_Nav/BOMItems_Nav&$filter=MaterialNum eq '${context.binding.Assembly}'`).then(function(results) {
               binding.HC_ROOT_CHILDCOUNT = 0;
               if (results && results.length > 0) {
                   binding.HC_ROOT_CHILDCOUNT = results.getItem(0).BOMHeader_Nav.BOMItems_Nav.length;
               }
               context.getPageProxy().setActionBinding(binding);
               return context.executeAction('/SAPAssetManager/Actions/WorkOrders/AssemblyListViewNav.action');
           }).catch(function(err) {
               Logger.error(`Failed to get BOMItems count : ${err}`);
           });
       }
       return true;
    });
}
