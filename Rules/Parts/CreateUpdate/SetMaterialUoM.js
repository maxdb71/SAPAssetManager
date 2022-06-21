import Logger from '../../Log/Logger';
import listPickerValidation from '../../Common/Validation/ListPickerValidation';

export default function SetMaterialUoM(context) {
    //On material change, re-filter MaterialUOMLstPkr by material
    try {
        let materialUOMListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialUOMLstPkr');
        let materialUOMLstPkrSpecifier = materialUOMListPicker.getTargetSpecifier();
        let materialUOMLstPkrQueryOptions = '$select=UOM&$orderby=UOM';
        let materialUOMs = '';
        listPickerValidation(context); // clear validation error if any when the list is not empty
        if (context.getValue().length > 0) {
            materialUOMs = context.getValue()[0].ReturnValue + '/Material/MaterialUOMs';

            materialUOMListPicker.setValue('');
        } else {
            materialUOMs = 'MaterialUOMs';
            materialUOMLstPkrQueryOptions += '&$filter=MaterialNum eq \'\'';
        }
        materialUOMLstPkrSpecifier.setEntitySet(materialUOMs);
        if (context.getPageProxy().evaluateTargetPathForAPI('#Control:OnlineSwitch').getValue()) {
            //materialUOMLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
        }
        materialUOMLstPkrSpecifier.setQueryOptions(materialUOMLstPkrQueryOptions);
        materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier);
            if (context.binding['@odata.type'] === '#sap_mobile.BOMItem') {
                materialUOMListPicker.setValue(context.binding.UoM);
                materialUOMListPicker.setEditable(false);
            }


        // If Storage Location picker is empty, set it to the current item's SLoc
        //let materialSLocPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:StorageLocationLstPkr');
        //let parts = SplitReadLink(context.getValue()[0].ReturnValue);
        //materialSLocPicker.setValue(parts.StorageLocation, false);
    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `PartLibrary.partCreateUpdateOnChange(MaterialLstPkr) error: ${err}`);
    }
}
