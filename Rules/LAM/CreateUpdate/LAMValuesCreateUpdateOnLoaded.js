import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Stylizer from '../../Common/Style/Stylizer';

export default function LAMValuesCreateUpdateOnLoaded(context) {
    let onCreate = libCom.IsOnCreate(context);
    let controls = libCom.getControlDictionaryFromPage(context);
    let disableMarker = false;
    let lrpValue = '';

    if (onCreate) {
        let lamObj = libCom.getStateVariable(context, 'LAMDefaultRow');

        if (!libVal.evalIsEmpty(lamObj)) {
            if (lamObj.LRPId) {
                controls.LRPLstPkr.setValue(lamObj.LRPId);
                lrpValue = lamObj.LRPId;
            } else {
                controls.LRPLstPkr.setValue('');
                disableMarker = true;
            }
            controls.StartPoint.setValue(String(libLocal.toNumber(context, lamObj.StartPoint,'',false)));
            controls.EndPoint.setValue(String(libLocal.toNumber(context, lamObj.EndPoint,'',false)));
            controls.Length.setValue(String(libLocal.toNumber(context, lamObj.Length,'',false)));
            controls.UOMLstPkr.setValue(lamObj.UOM);
            controls.MarkerUOMLstPkr.setValue(lamObj.MarkerUOM);
            controls.Offset1TypeLstPkr.setValue(lamObj.Offset1Type);
            controls.Offset1.setValue(String(libLocal.toNumber(context, lamObj.Offset1Value,'',false)));
            controls.Offset1UOMLstPkr.setValue(lamObj.Offset1UOM);
            controls.Offset2TypeLstPkr.setValue(lamObj.Offset2Type);
            controls.Offset2.setValue(String(libLocal.toNumber(context, lamObj.Offset2Value,'',false)));
            controls.Offset2UOMLstPkr.setValue(lamObj.Offset2UOM);
            if (lamObj.EndMarkerDistance !== '')
                controls.DistanceFromEnd.setValue(String(libLocal.toNumber(context, lamObj.EndMarkerDistance,'',false)));
            if (lamObj.StartMarkerDistance !== '')
                controls.DistanceFromStart.setValue(String(libLocal.toNumber(context, lamObj.StartMarkerDistance,'',false)));
            if (lamObj.StartMarker)
                controls.StartMarkerLstPkr.setValue(lamObj.StartMarker,false);
            if (lamObj.EndMarker)
                controls.EndMarkerLstPkr.setValue(lamObj.EndMarker,false);
        }
    } else { //Edit
        lrpValue = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:LRPLstPkr/#Value'));
        if (!lrpValue) {
            disableMarker = true;
        }
        //Trim spaces from numeric fields
        controls.StartPoint.setValue(String(context.evaluateTargetPath('#Control:StartPoint/#Value')).trim());
        controls.EndPoint.setValue(String(context.evaluateTargetPath('#Control:EndPoint/#Value')).trim());
        controls.Length.setValue(String(context.evaluateTargetPath('#Control:Length/#Value')).trim());
        controls.DistanceFromStart.setValue(String(context.evaluateTargetPath('#Control:DistanceFromStart/#Value')).trim());
        controls.DistanceFromEnd.setValue(String(context.evaluateTargetPath('#Control:DistanceFromEnd/#Value')).trim());
        controls.Offset1.setValue(String(context.evaluateTargetPath('#Control:Offset1/#Value')).trim());
        controls.Offset2.setValue(String(context.evaluateTargetPath('#Control:Offset2/#Value')).trim());
    }
    if  (!libCom.isOnChangeset(context)) {
        libCom.saveInitialValues(context);
    }
    if (disableMarker) { //Disable marker fields if no LRP
        controls.StartMarkerLstPkr.setEditable(false);
        controls.DistanceFromStart.setEditable(false);
        controls.EndMarkerLstPkr.setEditable(false);
        controls.DistanceFromEnd.setEditable(false);
        controls.MarkerUOMLstPkr.setEditable(false);
        let stylizer = new Stylizer(['GrayText']);
        stylizer.apply(controls.StartMarkerLstPkr , 'Value');
        stylizer.apply(controls.DistanceFromStart , 'Value');
        stylizer.apply(controls.EndMarkerLstPkr , 'Value');
        stylizer.apply(controls.DistanceFromEnd , 'Value');
        stylizer.apply(controls.MarkerUOMLstPkr , 'Value');
    } else { // Markers enabled, set list dropdown filter
        let startMarkerLstPkr = libCom.getControlProxy(context.getPageProxy(), 'StartMarkerLstPkr');
        let endMarkerLstPkr = libCom.getControlProxy(context.getPageProxy(), 'EndMarkerLstPkr');
        let specifier = startMarkerLstPkr.getTargetSpecifier();
        specifier.setEntitySet('LinearReferencePatternItems');
        specifier.setQueryOptions(`$filter=(LRPId eq '${lrpValue}' and StartPoint ne '')&$orderby=Marker`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        return startMarkerLstPkr.setTargetSpecifier(specifier).then(() => {
            startMarkerLstPkr.setValue(context.binding.StartMarker);
            return endMarkerLstPkr.setTargetSpecifier(specifier).then(() => {
                endMarkerLstPkr.setValue(context.binding.EndMarker);
                return Promise.resolve(true);
            });
        });
    }
    return Promise.resolve(true);
}
