/**
* Get the array of Mobile Statuses in term of promises from the Table
* @param {IClientAPI} context
*/
import Logger from '../../Log/Logger';

export default function NotificationMobileStatusesFromTable(context) {
    let nextStatuses = [];
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/NotifMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], '$expand=NextOverallStatusCfg_Nav').then(codes => {
        
        codes.forEach(element => {
            nextStatuses.push(element.NextOverallStatusCfg_Nav);
        });
        
        return nextStatuses;
    }).catch((error) => {
        Logger.error('Failed to read OverallStatusCfgNav with error' + error);
        return nextStatuses;
    });
    
}
