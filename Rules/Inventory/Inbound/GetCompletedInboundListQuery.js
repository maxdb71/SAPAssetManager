import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function GetCompletedInboundListQuery() {
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');

    if (!plant) {
        plant = '';
    }

    //return "$expand=PurchaseOrderHeader_Nav,InboundDelivery_Nav&$filter=((IMObject eq 'PO') or (IMObject eq 'IB') or (IMObject eq 'ST')) and ((PurchaseOrderHeader_Nav/DocumentStatus eq 'C') or InboundDelivery_Nav/GoodsMvtStatus eq 'C')";	
    return "$filter=((IMObject eq 'PO' and PurchaseOrderHeader_Nav/DocumentStatus eq 'C') or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant ne '" + plant + "' and StockTransportOrderHeader_Nav/DocumentStatus eq 'C') or (IMObject eq 'IB' and InboundDelivery_Nav/GoodsMvtStatus eq 'C'))";
}
