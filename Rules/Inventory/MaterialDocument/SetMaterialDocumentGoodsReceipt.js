import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';
import reloadMaterialDocumentItem from '../MaterialDocumentItem/ReloadMaterialDocumentItem';

export default function SetMaterialDocumentGoodsReceipt(context) {

    let binding = context.getPageProxy().getActionBinding();

    if (binding['@sap.isLocal']) { //Only allow editing of local material document items
        let readLink = binding['@odata.readLink'];
        return reloadMaterialDocumentItem(context, readLink).then(function(newItem) {        
            context.getPageProxy().setActionBinding(newItem);  //Rebind the mat doc item we just reloaded to get the latest snapshot
            binding = newItem;

            if (binding.PurchaseOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'PO');
            } else if (binding.StockTransportOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'STO');
            } else if (binding.ReservationItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'RES');
            }

            if (binding.AssociatedMaterialDoc && binding.AssociatedMaterialDoc.GMCode) {
                let gmCode = binding.AssociatedMaterialDoc.GMCode;

                if (gmCode === '03' || gmCode === '04') {
                    libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
                    if (gmCode === '04' && !binding.StockTransportOrderItem_Nav) {
                        libCom.setStateVariable(context, 'IMObjectType', 'TRF'); 
                    }
                } else if ((gmCode === '01' || gmCode === '02' || gmCode === '05')) {
                    libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
                }
            }
            return wrapper(context);
        });
    }
}
