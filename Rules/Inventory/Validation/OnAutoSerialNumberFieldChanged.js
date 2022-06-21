export default function OnAutoSerialNumberFieldChanged(context) {
    
    if (context.getValue()) {
        context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum').setVisible(false);
        //context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumAdd').setVisible(false);
        //context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListPicker').setVisible(false);
        context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListText').setVisible(false);
        context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple').setEditable(true);
        context.getPageProxy().getControl('FormCellContainer').getControl('MyExtensionControlName').setVisible(false);
    } else {
        context.getPageProxy().getControl('FormCellContainer').getControl('SerialNum').setVisible(true);
        //context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumAdd').setVisible(true);
        //context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListPicker').setVisible(true);
        context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumListText').setVisible(true);
        context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple').setEditable(false);
        context.getPageProxy().getControl('FormCellContainer').getControl('MyExtensionControlName').setVisible(true);
    }

    return true;
}
