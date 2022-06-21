import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import common from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import libNotif from '../NotificationLibrary';

export default function NotificationCreateUpdateOnPageLoad(context) {
    hideCancel(context);
    var caption;
    var onCreate = common.IsOnCreate(context);
    var container = context.getControls()[0];
    var binding = context.binding;

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        caption = context.localizeText('record_defect');
    } else {
        if (onCreate) {
            caption = context.localizeText('add_notification');
        } else {
            caption = context.localizeText('edit_notification');

            if (!common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
                container.getControl('TypeLstPkr').setEditable(false);
            }
            ///Notification type can't be edit on local notifications
            if (!onCreate && common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
                container.getControl('TypeLstPkr').setEditable(false);
            }
            let formCellContainer = context.getControl('FormCellContainer');
            let stylizer = new Stylizer(['GrayText']);
            let typePkr = formCellContainer.getControl('TypeLstPkr');
            stylizer.apply(typePkr, 'Value');

            //Malfunction date/time
            let startDate = formCellContainer.getControl('MalfunctionStartDatePicker');
            let startTime = formCellContainer.getControl('MalfunctionStartTimePicker');
            let endDate = formCellContainer.getControl('MalfunctionEndDatePicker');
            let endTime = formCellContainer.getControl('MalfunctionEndTimePicker');
            let startSwitch = formCellContainer.getControl('BreakdownStartSwitch');
            let endSwitch = formCellContainer.getControl('BreakdownEndSwitch');
            let breakdown = formCellContainer.getControl('BreakdownSwitch').getValue();

            if (breakdown) {
                startDate.setVisible(true);
                startTime.setVisible(true);
                endDate.setVisible(true);
                endTime.setVisible(true);
                startSwitch.setVisible(true);
                endSwitch.setVisible(true);
            }

            if (startSwitch.getValue()) {
                startDate.setEditable(true);
                startTime.setEditable(true);
            }

            if (endSwitch.getValue()) {
                endDate.setEditable(true);
                endTime.setEditable(true);
            }
        }
    }

    context.setCaption(caption);
    // Set Object Part Group picker
    libNotif.NotificationTaskActivityGroupQuery(context, 'CatTypeObjectParts').then(query => {
        let specifier = container.getControl('PartGroupLstPkr').getTargetSpecifier();
        specifier.setQueryOptions(query);
        container.getControl('PartGroupLstPkr').setTargetSpecifier(specifier);
    });
    // Set Damage Group picker
    libNotif.NotificationTaskActivityGroupQuery(context, 'CatTypeDefects').then(query => {
        let specifier = container.getControl('DamageGroupLstPkr').getTargetSpecifier();
        specifier.setQueryOptions(query);
        container.getControl('DamageGroupLstPkr').setTargetSpecifier(specifier);
    });

    // Set Cause Group picker
    libNotif.NotificationItemTaskActivityGroupQuery(context, 'CatTypeCauses').then(query => {
        let specifier = container.getControl('CauseGroupLstPkr').getTargetSpecifier();
        specifier.setQueryOptions(query);
        container.getControl('CauseGroupLstPkr').setTargetSpecifier(specifier);
    });

    if (libNotif.getAddFromJobFlag(context)) {
        container.getControl('EquipHierarchyExtensionControl').setEditable(true);
        container.getControl('FuncLocHierarchyExtensionControl').setEditable(true);
    }

    style(context, 'DiscardButton');
     //Set Failure Group and Detection Group
    libNotif.setFailureAndDetectionGroupQuery(context).then(() => {
        common.saveInitialValues(context);
    });

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        let typePicker = context.getControl('FormCellContainer').getControl('TypeLstPkr');
        let specifier = typePicker.getTargetSpecifier();

        specifier.setEntitySet('OrderTypes');
        specifier.setQueryOptions(`$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setDisplayValue('{{#Property:EAMNotifType}} - {{#Property:OrderTypeDesc}}');
        specifier.setReturnValue('{EAMNotifType}');

        typePicker.setTargetSpecifier(specifier).then(() => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`).then(function(result) {
                if (result.length === 1) {
                    typePicker.setValue(result.getItem(0).EAMNotifType);
                }
            });
        });
    }
}
