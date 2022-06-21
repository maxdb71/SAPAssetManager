import Logger from '../../Log/Logger';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockOfflineHeaderCaption(context) {
    let queryOption = '';
    let offlineQueryOptions = '';
    try {
        offlineQueryOptions = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions;
    } catch (err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryChecklists.global').getValue(),`StockOfflineHeaderCaption error: ${err}`);
    }
    if (context.searchString && offlineQueryOptions) {
        queryOption = '$expand=Material,MaterialPlant&$filter=' + offlineQueryOptions.substring(0, offlineQueryOptions.indexOf(')')) + `) and (substringof('${context.searchString}', tolower(MaterialNum)) or substringof('${context.searchString}', tolower(Plant)) or substringof('${context.searchString}', tolower(StorageLocation)) or substringof('${context.searchString}', tolower(Material/Description)))`;
    } else if (context.searchString) {
        queryOption = `$expand=Material,MaterialPlant&$filter=(substringof('${context.searchString}', tolower(MaterialNum)) or substringof('${context.searchString}', tolower(Plant)) or substringof('${context.searchString}', tolower(StorageLocation)) or substringof('${context.searchString}', tolower(Material/Description)))`;
    } else if (offlineQueryOptions) {
        queryOption = '$expand=Material,MaterialPlant&$filter=' + offlineQueryOptions;
    }
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'MaterialSLocs',
        [],
        queryOption).then(result => {
            if (result && result.length > 0) {
                return context.localizeText('offline_stock') + ' (' + result.length + ')';
            }
            return context.localizeText('offline_stock');
        });
}
