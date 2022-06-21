import libCommon from '../../Common/Library/CommonLibrary';


export default function LAMValuesCreateUpdateOnSave(pageProxy) {
    let onCreate = libCommon.IsOnCreate(pageProxy);

    if (onCreate) {
        let type = libCommon.getStateVariable(pageProxy, 'LAMCreateType');
        if (type === 'MeasurementPoint') {
            return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMMeasurementPointDataCreate.action');
        } else if (type === 'Confirmation') {
            return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMConfirmationDataCreate.action');
        }
    } else {
        return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMDataUpdate.action');
    }

}
