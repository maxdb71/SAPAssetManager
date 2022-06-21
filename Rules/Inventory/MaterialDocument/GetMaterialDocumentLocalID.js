import GenerateLocalID from '../../Common/GenerateLocalID';
import libVal from '../../Common/Library/ValidationLibrary';

export default function GetMaterialDocumentLocalID(context) {
    //return GenerateLocalID(context, 'MyWorkOrderHeaders', 'OrderId', '00000', "$filter=startswith(OrderId, 'LOCAL') eq true", 'LOCAL_W').then(LocalId => {
    return GenerateLocalID(context, 'MaterialDocuments', 'MaterialDocNumber', '00000', "$filter=startswith(MaterialDocNumber, 'LOCAL') eq true", 'LOCAL').then(LocalId => {
        if (!libVal.evalIsEmpty(context.binding)) {
            context.binding.TempHeader_Key = LocalId;
        } else if (!libVal.evalIsEmpty(context.getActionBinding())) {
            context.getActionBinding().TempHeader_Key = LocalId;
        }
        return LocalId;
    });
}
