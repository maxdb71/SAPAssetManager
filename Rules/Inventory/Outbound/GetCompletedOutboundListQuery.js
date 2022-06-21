
import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function GetCompletedOutboundListQuery() {
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');

    if (!plant) {
        plant = '';
    }

    return "$filter=((IMObject eq 'OB' and OutboundDelivery_Nav/GoodsMvtStatus eq 'C') or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant eq '" + plant + "' and StockTransportOrderHeader_Nav/DocumentStatus eq 'C') or (IMObject eq 'RS' and ReservationHeader_Nav/DocumentStatus eq 'C'))";
    //return "$expand=OutboundDelivery_Nav,ReservationHeader_Nav&$filter=((IMObject eq 'OB') or (IMObject eq 'RS')) and (OutboundDelivery_Nav/GoodsMvtStatus eq 'C' or ReservationHeader_Nav/DocumentStatus eq 'C')";	
}

//return "$filter=((IMObject eq 'PO' and PurchaseOrderHeader_Nav/DocumentStatus eq 'C') or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant ne '" + plant + "' and StockTransportOrderHeader_Nav/DocumentStatus eq 'C') or (IMObject eq 'IB' and InboundDelivery_Nav/GoodsMvtStatus eq 'C'))";
