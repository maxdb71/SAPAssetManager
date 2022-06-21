import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function LAMObjectFromControls(controls) {

    if (!libVal.evalIsEmpty(controls.StartPoint.getValue()) && !libVal.evalIsEmpty(controls.EndPoint.getValue())) {
        var lamObj = {
            Point: controls.PointSim.getValue(),
            LRPId: controls.LRPLstPkr.getValue(),
            StartPoint: controls.StartPoint.getValue(),
            EndPoint: controls.EndPoint.getValue(),
            Length: controls.Length.getValue(),
            UOM: libCom.getListPickerValue(controls.UOMLstPkr.getValue()),
            StartMarker: libCom.getListPickerValue(controls.StartMarkerLstPkr.getValue()),
            EndMarker: libCom.getListPickerValue(controls.EndMarkerLstPkr.getValue()),
            DistanceFromStart: controls.DistanceFromStart.getValue(),
            DistanceFromEnd: controls.DistanceFromEnd.getValue(),
            MarkerUOM: libCom.getListPickerValue(controls.MarkerUOMLstPkr.getValue()),
            Offset1Type: libCom.getListPickerValue(controls.Offset1TypeLstPkr.getValue()),
            Offset1: controls.Offset1.getValue(),
            Offset1UOM: libCom.getListPickerValue(controls.Offset1UOMLstPkr.getValue()),
            Offset2Type: libCom.getListPickerValue(controls.Offset2TypeLstPkr.getValue()),
            Offset2: controls.Offset2.getValue(),
            Offset2UOM: libCom.getListPickerValue(controls.Offset2UOMLstPkr.getValue()),
        };
        return lamObj;
    } else {
        return false;
    }
}
