import Logger from '../Log/Logger';

export default function TokenRequest(context) {
    context.showActivityIndicator(context.localizeText('online_esritoken_search_activityindicator_text'));
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'OauthTokens', [], '$filter=ParameterGroup eq \'EXTERNALCONNECTIONS\'').then(function(result) {
                if (result && result.getItem(0) && result.getItem(0).OauthToken) {
                    let item = result.getItem(0);
                    let obj = {};
                    obj.access_token = item.OauthToken;
                    obj.expires_in = item.ExpiresIn;

                    return obj;
                }
                
                Logger.error('Failed to retrieve a valid token');
                return null; 
            }).catch(function(err) {
                Logger.error(`Failed to complete the online read: ${err}`);
                return null;
            });
        }).catch(function(err) {
            // Could not open online service
            Logger.error(`Failed to open Online OData Service: ${err}`);
            return null;
        });
    }).catch(function(err) {
        // Could not init online service
        Logger.error(`Failed to initialize Online OData Service: ${err}`);
        return null;
    }).finally(function() {
        context.dismissActivityIndicator();
    });
}
