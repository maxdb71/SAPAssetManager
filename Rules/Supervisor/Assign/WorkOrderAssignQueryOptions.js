import libVal from '../../Common/Library/ValidationLibrary';
export default function WorkOrderAssignQueryOptions(context) {
    try {
        let partnerFunction = 'VW';
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            return `$filter=OrderId eq '${context.binding.OrderId}'`;
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            return `$filter=WOPartners/all(vw:vw/PartnerFunction ne '${partnerFunction}')&$expand=WOPartners&$orderby=OrderId`;
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            return `$filter=OrderId eq '${context.binding.OrderId}'`;
        }
        return `$filter=WOPartners/all(vw:vw/PartnerFunction ne '${partnerFunction}')&$expand=WOPartners&$orderby=OrderId`;
    } catch (error) {
        let partnerType = 'VW';
        return `$filter=WOPartners/all(vw:vw/PartnerFunction ne '${partnerType}')&$expand=WOPartners&$orderby=OrderId`;
    }
}
