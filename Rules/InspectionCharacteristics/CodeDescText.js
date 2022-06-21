import libVal from '../Common/Library/ValidationLibrary';

export default function CodeDescText(context) {
    if (libVal.evalIsEmpty(context.binding.CodeGroup)) {
        return context.binding.ResultValue;
    }
    return context.binding.InspectionCode_Nav.CodeDesc;
}
