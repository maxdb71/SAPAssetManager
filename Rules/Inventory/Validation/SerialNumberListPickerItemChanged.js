
export default function SerialNumberListPickerItemChanged(context) {
    
    let serialNumbers = context.getValue();
    let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
    quantity.setValue(serialNumbers.length);
    quantity.setEditable(false);
}
