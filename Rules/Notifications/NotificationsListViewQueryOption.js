import libVal from '../Common/Library/ValidationLibrary';
import phaseModel from '../Common/IsPhaseModelEnabled';
import phaseModelExpands from '../PhaseModel/PhaseModelListViewQueryOptionExpand';

export default function NotificationsListViewQueryOption(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WorkOrder,NotifPriority,NotifMobileStatus_Nav,NotifDocuments,NotifDocuments/Document,HeaderLongText,FunctionalLocation,Equipment,NotifMobileStatus_Nav/OverallStatusCfg_Nav');
    queryBuilder.orderBy('Priority,ObjectKey,NotificationNumber,OrderId,NotifDocuments/DocumentID,NotifMobileStatus_Nav/MobileStatus');
    if (phaseModel(context)) {
        let phaseModelNavlinks = phaseModelExpands('QMI');
        queryBuilder.expand(phaseModelNavlinks);
    }

    if (context.searchString) {
        let searchFilters = [
            `substringof('${context.searchString.toLowerCase()}', tolower(NotificationNumber))`,
            `substringof('${context.searchString.toLowerCase()}', tolower(NotificationDescription))`,
        ];
        queryBuilder.filter(searchFilters.join(' or '));
    }
    if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        queryBuilder.orderBy('Priority');
        queryBuilder.filter(`HeaderEquipment eq '${context.binding.EquipId}'`);
        return queryBuilder;
    } else {
        return queryBuilder;
    }
}
