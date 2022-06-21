import libCommon from '../../Common/Library/CommonLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import WorkCenterPlant from '../../Common/Controls/WorkCenterPlantControl';
import assnType from '../../Common/Library/AssignmentType';

export function executeChangeSetAction(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    //set the WoChangeSet flag to false
    libCommon.setOnWOChangesetFlag(context, false);
    context.setActionBinding(context.binding);
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return context.executeAction('/SAPAssetManager/Actions/Parts/BOM/BOMCreateChangeSet.action');
    }
    libCommon.setStateVariable(context, 'PartAdd', true);
    return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateChangeSet.action');
}

/**
 * Can't add part to local job.
 * @param {*} context 
 */
export default function PartCreateNav(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let storageLocation = libCommon.getUserDefaultStorageLocation();
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    
    if (libCommon.isDefined(storageLocation)) {
        context.binding.StorageLocation = storageLocation;
    } else {
        context.binding.StorageLocation = '';
    }
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        let assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(context);
        let workcenter = '';
        if (assnTypeLevel === 'Header') {
            workcenter = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'WorkCenterPlant');
        } else if (assnTypeLevel === 'Operation') {
            workcenter = assnType.getWorkOrderFieldDefault('WorkOrderOperation', 'WorkCenterPlant');
        } else if (assnTypeLevel === 'Operation') {
            workcenter = assnType.getWorkOrderFieldDefault('WorkOrderSubOperation', 'WorkCenterPlant');
        }
        if (libCommon.isDefined(workcenter)) {
            context.binding.Plant = workcenter;
        } else {
            context.binding.Plant = libCommon.getAppParam(context, 'WORKORDER', 'PlanningPlant');
        }
        return executeChangeSetAction(context);
    }
    
    return WorkCenterPlant.getOperationPageDefaultValue(context).then(function(plant) {
        if (!libCommon.isDefined(plant)) {
            context.binding.Plant = libCommon.getAppParam(context, 'WORKORDER', 'PlanningPlant');
        } else {
            context.binding.Plant = plant;
        }
        if (isLocal) {
            return executeChangeSetAction(context);
        } 
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                return executeChangeSetAction(context);
            }
            return '';
        });
    });
}
