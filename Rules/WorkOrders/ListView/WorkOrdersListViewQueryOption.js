import { WorkOrderLibrary as libWo} from '../WorkOrderLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import phaseModelExpand from '../../PhaseModel/PhaseModelListViewQueryOptionExpand';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function WorkOrdersListViewQueryOption(context) {
    let searchString = context.searchString;
    let clockedInString = context.localizeText('clocked_in').substring('Clocked In');
    let lowercaseClockedInString = context.localizeText('clocked_in_lowercase').substring('clocked in');

    if ((searchString !== '') && (searchString === clockedInString) || (searchString === lowercaseClockedInString)) {
        let queryBuilder = context.dataQueryBuilder();
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup','OrderId', 'WOHeader_Nav/ObjectKey'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav').then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                if (row.PreferenceGroup === 'CLOCK_IN') {
                    queryBuilder.expand('UserTimeEntry_Nav');
                    queryBuilder.filter(`OrderId eq '${row.OrderId}'`);
                    return queryBuilder;
                }
                return queryBuilder(''); 
            }
            return queryBuilder(''); 
        }).catch(() => {
            return queryBuilder(''); //Read failure so return a blank string
        });
    }
    let filter = '';
    let filters = [];
    let queryBuilder;
    searchString = searchString.toLowerCase();
    if (searchString) {
        //Standard order filters (required when using a dataQueryBuilder)
        filters.push(`substringof('${searchString}', tolower(OrderId))`);
        filters.push(`substringof('${searchString}', tolower(WOPriority/PriorityDescription))`);
        filters.push(`substringof('${searchString}', tolower(OrderDescription))`);
        if (libSuper.isSupervisorFeatureEnabled(context)) {
            //Supervisor assigned to filters
            filters.push(`WOPartners/any(wp : wp/PartnerFunction eq 'VW' and (substringof('${searchString}', tolower(wp/Employee_Nav/FirstName)) or substringof('${searchString}', tolower(wp/Employee_Nav/LastName))))`);
        }
        filter = '(' + filters.join(' or ') + ')';
    }
    if (libCommon.isDefined(context.binding)) {
        if (libCommon.isDefined(context.binding.isHighPriorityList)) {
            queryBuilder = libWo.getHighPriorityWorkOrdersQueryOptions(context);
        } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
            queryBuilder = libSuper.getFilterForWOPendingReview(context);
        } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
            queryBuilder = libSuper.getFilterForSubmittedWO(context);
        }
        if (queryBuilder) {
            if (IsPhaseModelEnabled(context)) {
                queryBuilder.expand(phaseModelExpand('ORI'));
            }
            if (filter) {
                queryBuilder.filter().and(filter);
            }
            return queryBuilder;
        }
    }
    queryBuilder = libWo.getWorkOrdersListViewQueryOptions(context);
    if (IsPhaseModelEnabled(context)) {
        queryBuilder.expand(phaseModelExpand('ORI'));
    }
    if (filter) {
        queryBuilder.filter(filter);
    }
    return queryBuilder;
}
