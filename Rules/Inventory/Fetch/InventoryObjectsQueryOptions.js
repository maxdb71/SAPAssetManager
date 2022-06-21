import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InventoryObjectsQueryOptions(context) {

    let filter = '$filter=';
    let documentID = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DocumentId').getValue();
    let documentType = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DocumentTypeListPicker').getValue();
    let dateRangeSwitch = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DateRangeSwitch').getValue();
    let startDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:StartDate').getValue();
    let endDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:EndDate').getValue();
    let plant = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:PlantLstPkr').getValue();
    let deliveryDateFlag = false;
    let requirementDateFlag = false;

    let odataStartDate = new ODataDate(startDate);
    let odataEndDate = new ODataDate(endDate);

    if (!libVal.evalIsEmpty(documentID) && documentID.length > 0) {
        filter = filter + `ObjectId eq '${documentID}' and `;
    }

    if (plant.length > 0) {
        filter = filter + `Plant eq '${plant[0].ReturnValue}' and `;
    }
    
    if (documentType.length === '0') {
        filter = filter + 'IMObject eq \'ALL\'';
    } else {
        if (documentType.length > 0) {
            filter = filter + '(';
            for (let i = 0; i < documentType.length; i++) {
                if (i > 0) {
                    filter = filter + ' or ';
                }
                switch (documentType[i].ReturnValue) {
                    case 'PO':
                        filter = filter + 'IMObject eq \'PO\'';
                        deliveryDateFlag = true;
                        break;
                    case 'IB':
                        filter = filter + 'IMObject eq \'IB\'';
                        deliveryDateFlag = true;
                        break;
                    case 'ST':
                        filter = filter + 'IMObject eq \'ST\'';
                        deliveryDateFlag = true;
                        break;
                    case 'OB':
                        filter = filter + 'IMObject eq \'OB\'';
                        deliveryDateFlag = true;
                        break;
                    case 'RS':
                        filter = filter + 'IMObject eq \'RS\'';
                        requirementDateFlag = true;
                        break;
                    default:
                        break;
                }
            }
            filter = filter + ')';
        }
    }

    if (dateRangeSwitch) {
        if (deliveryDateFlag) {
            filter = filter + ` and DelvDateFrom ge datetime'${odataStartDate.toDBDateString(context)}' and DelvDateTo le datetime'${odataEndDate.toDBDateString(context)}'`;
        }
        if (requirementDateFlag) {
            filter = filter + ` and RequirementDateFrom ge datetime'${odataStartDate.toDBDateString(context)}' and RequirementDateTo le datetime'${odataEndDate.toDBDateString(context)}'`;
        }
    }

    filter = filter + '&$orderby=ObjectId,IMObject';

    return filter;
}
