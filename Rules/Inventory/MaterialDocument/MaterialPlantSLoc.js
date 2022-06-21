import libVal from '../../Common/Library/ValidationLibrary';
import common from '../../Common/Library/CommonLibrary';

export default function MaterialPlantSLoc(context) {
    if (!libVal.evalIsEmpty(context.binding.Plant) && !libVal.evalIsEmpty(context.binding.StorageLocation)) {
        return context.binding.Plant + ' - ' + context.binding.StorageLocation;
    } else if (!libVal.evalIsEmpty(context.binding.Plant)) {
        return common.getPlantName(context, context.binding.Plant);
    } else if (!libVal.evalIsEmpty(context.binding.StorageLocation)) {
        return context.binding.StorageLocation;
    }
}
