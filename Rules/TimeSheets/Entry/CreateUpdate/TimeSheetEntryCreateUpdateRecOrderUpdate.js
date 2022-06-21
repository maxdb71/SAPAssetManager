import libCom from '../../../Common/Library/CommonLibrary';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function TimeSheetEntryCreateUpdateRecOrderUpdate(controlProxy) {
    let pageProxy = controlProxy.getPageProxy();
    let selection = controlProxy.getValue()[0] ? controlProxy.getValue()[0].ReturnValue : '';
    let opListPickerProxy = libCom.getControlProxy(pageProxy,'OperationLstPkr');
    let subOpListPickerProxy = libCom.getControlProxy(pageProxy,'SubOperationLstPkr');
    let activityListPickerProxy = libCom.getControlProxy(pageProxy,'ActivityTypeLstPkr');

    if (libVal.evalIsEmpty(selection)) { //No order, so disable and empty op and sub-op pickers
        opListPickerProxy.setValue('');
        subOpListPickerProxy.setValue('');
        let entity = 'MyWorkOrderOperations';
        let filter = "$filter=OperationNo eq ''";
        return libTS.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            libCom.setFormcellNonEditable(opListPickerProxy);
            libCom.setFormcellNonEditable(subOpListPickerProxy);
            libCom.setFormcellNonEditable(activityListPickerProxy);
            entity = 'MyWorkOrderSubOperations';
            filter = "$filter=SubOperationNo eq ''";    
            return libTS.setSubOperationSpecifier(subOpListPickerProxy, entity, filter);                        
        });
    } else {
        libCom.setFormcellEditable(opListPickerProxy);
        let entity = selection + '/Operations';
        let filter = '$orderby=OperationNo asc';
        opListPickerProxy.setValue('');
        subOpListPickerProxy.setValue('');
        return libTS.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => { //Populate op picker from chosen order
            return libTS.GetWorkCenterFromObject(pageProxy, selection).then(newWorkCenter => {
                if (newWorkCenter) {
                    return libTS.updateWorkCenter(controlProxy.getPageProxy(), newWorkCenter).then(() => {
                        libCom.setFormcellNonEditable(subOpListPickerProxy);
                        entity = 'MyWorkOrderSubOperations';
                        filter = "$filter=SubOperationNo eq ''";    
                        return libTS.setSubOperationSpecifier(subOpListPickerProxy, entity, filter);
                    });
                }
                return Promise.resolve(true);
            });
        });
    }
}
