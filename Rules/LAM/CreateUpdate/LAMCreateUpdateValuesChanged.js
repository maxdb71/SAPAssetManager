
import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMCreateUpdateValuesChanged(context) {
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    let length = 0;


    if (libLocal.isNumber(context, start) && libLocal.isNumber(context, end)) {
        length = Math.abs(libLocal.toNumber(context, end) - libLocal.toNumber(context, start)); //Must be positive number
        controls.Length.setValue(context.formatNumber(length,'', {useGrouping: false}));
    }
    let lrpId = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'LRPLstPkr', '', null, true));
    let startMarkerValue = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'StartMarkerLstPkr', '', null, true));
    let endMarkerValue = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'EndMarkerLstPkr', '', null, true));

    if (!libVal.evalIsEmpty(startMarkerValue) && libLocal.isNumber(context, start)) {
        var startDistance = 0;
        context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${startMarkerValue}' and StartPoint ne '')`).then(function(result) {
            if (result && result.length > 0) {
                let marker = result.getItem(0);
                let markerValue = libLocal.toNumber(context,marker.StartPoint);
                startDistance = libLocal.toNumber(context, start) - markerValue;
                controls.DistanceFromStart.setValue(context.formatNumber(startDistance)); 
            } else {
                controls.DistanceFromStart.setValue('');
            }
        });
    }

    if (!libVal.evalIsEmpty(endMarkerValue) && libLocal.isNumber(context, end)) {
        var endDistance = 0;
        context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${endMarkerValue}' and StartPoint ne '')`).then(function(result) {
            if (result && result.length > 0) {
                let marker = result.getItem(0);
                let markerValue = libLocal.toNumber(context, marker.StartPoint);
                endDistance = libLocal.toNumber(context, end) - markerValue;
                controls.DistanceFromEnd.setValue(context.formatNumber(endDistance));  
            } else {
                controls.DistanceFromEnd.setValue('');
            }
        });

    }

}
