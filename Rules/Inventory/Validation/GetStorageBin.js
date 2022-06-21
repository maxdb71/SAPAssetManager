import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function GetStorageBin(context) {

    if (!libVal.evalIsEmpty(context.binding)) {
        if (context.binding.hasOwnProperty('StorageBin') && !libVal.evalIsEmpty(context.binding.StorageBin)) {
            return context.binding.StorageBin;
        }
    }

    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (!(objectType === 'ADHOC')) {
        let material;
        let plant;
        let storageLocation;
        if (!libVal.evalIsEmpty(context.binding)) {
            if (!libVal.evalIsEmpty(context.binding.Material)) {
                material = context.binding.Material;
            } else if (!libVal.evalIsEmpty(context.binding.MaterialNum)) {
                material = context.binding.MaterialNum;
            }

            if (!libVal.evalIsEmpty(context.binding.Plant)) {
                plant = context.binding.Plant;
            } else if (!libVal.evalIsEmpty(context.binding.SupplyPlant)) {
                plant = context.binding.SupplyPlant;
            }

            if (!libVal.evalIsEmpty(context.binding.StorageLoc)) {
                storageLocation = context.binding.StorageLoc;
            } else if (!libVal.evalIsEmpty(context.binding.SupplyStorageLocation)) {
                storageLocation = context.binding.SupplyStorageLocation;
            } else if (!libVal.evalIsEmpty(context.binding.StorageLocation)) {
                storageLocation = context.binding.StorageLocation;
            }
        }
        if (material && plant && storageLocation) {
            return context.read(
                '/SAPAssetManager/Services/AssetManager.service',
                'MaterialSLocs',
                [],
                "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "' and StorageLocation eq '" + storageLocation + "'").then(result => {
                    if (result && result.length > 0) {
                        // Grab the first row (should only ever be one row)
                        let row = result.getItem(0);
                        return row.StorageBin;
                    }
                    return '';
            });
        }
    }
    return '';
}
