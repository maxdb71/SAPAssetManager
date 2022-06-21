import libCom from '../../Common/Library/CommonLibrary';
import libPart from '../PartLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function PartCreateUpdateOnPageLoad(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(context);
    style(context, 'DiscardButton');

    // set Material list picker
    let decision = '';
    if (decision == true) {
        let myPlant = context.getPageProxy().getBindingObject().Plant;
        let myStore = context.getPageProxy().getBindingObject().myStore;
        let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
        let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
        let materialLstPkrQueryOptions = '$orderby=MaterialNum&$expand=Material,MaterialPlant';
        let newFilterOpts = [`Plant eq '${myPlant}'`];
        newFilterOpts.push(`StorageLocation eq '${myStore}'`);
        materialLstPkrQueryOptions += '&$filter=' + newFilterOpts.join(' and ');
        materialLstPkrSpecifier.setQueryOptions(materialLstPkrQueryOptions);
        materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, true)
    }

    let binding = context.binding;
    let textCategory = libCom.getAppParam(context, 'PART', 'TextItemCategory');
    let textDescription = context.localizeText('text_item');
    let description = libPart.getPartPlusDescription(context, binding.ItemCategory, textCategory, binding.TextTypeDesc, textDescription, binding.ComponentDesc, binding.MaterialNum, true, true);
    if (libCom.IsOnCreate(context)) {
        description = context.localizeText('add_part');
    } else {
        description = context.localizeText('edit_part');
    }

    context.setCaption(description);
    let partCategoryValue = context.evaluateTargetPath('#Control:PartCategoryLstPkr').getValue()[0].ReturnValue;

    if (partCategoryValue === textCategory) {
        // Disable Stock Item pickers
        context.evaluateTargetPath('#Control:MaterialLstPkr').setVisible(false);
        context.evaluateTargetPath('#Control:MaterialUOMLstPkr').setVisible(false);
        context.evaluateTargetPath('#Control:StorageLocationLstPkr').setVisible(false);
        context.evaluateTargetPath('#Control:UOMSim').setVisible(false);

        // Enable Text Picker items
        context.evaluateTargetPath('#Control:TextItemSim').setVisible(true);

    }
    libCom.saveInitialValues(context);
}
