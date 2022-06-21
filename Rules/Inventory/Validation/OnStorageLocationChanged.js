import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function OnStorageLocationChanged(context) {
    if (context.getValue().length > 0) {
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

                if (!libVal.evalIsEmpty(context.getValue()[0].ReturnValue)) {
                    storageLocation = context.getValue()[0].ReturnValue;
                }
            }
            if (material && plant && storageLocation) {
                let storageBinSimple = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
                return context.read(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MaterialSLocs',
                    [],
                    "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "' and StorageLocation eq '" + storageLocation + "'").then(result => {
                        if (result && result.length > 0) {
                            // Grab the first row (should only ever be one row)
                            let row = result.getItem(0);
                            storageBinSimple.setValue(row.StorageBin);
                            return true;
                        }
                        return true;
                });
            }
        }
        return true;
    }
}
