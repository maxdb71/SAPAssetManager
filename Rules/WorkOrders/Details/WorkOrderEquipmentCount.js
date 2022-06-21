import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderEquipmentCount(sectionProxy) {
    let orderId = sectionProxy.getPageProxy().binding.OrderId;
    return CommonLibrary.getEntitySetCount(sectionProxy, 'MyEquipments', `$filter=WorkOrderHeader/any( wo: wo/OrderId eq '${orderId}' ) or WorkOrderOperation/WOHeader/any(wo: wo/OrderId eq '${orderId}' ) or WorkOrderSubOperation/WorkOrderOperation/WOHeader/any( wo: wo/OrderId eq '${orderId}' )`).then(count => {
        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
        return count;
    });
}
