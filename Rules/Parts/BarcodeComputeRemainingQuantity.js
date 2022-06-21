import libPart from './PartLibrary';
export default function BarcodeComputeRemainingQuantity(context) {
    let requirementQuantity = context.binding.RequirementQuantity;
    let withdrawnQuantity = context.binding.WithdrawnQuantity;
    return libPart.getLocalQuantityIssued(context).then(result => {
        return requirementQuantity - (withdrawnQuantity + result);
    }).catch(() => {
        return requirementQuantity;
    });
}
