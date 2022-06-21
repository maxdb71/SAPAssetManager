export default function GetItemText(context) {
   
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.ItemText;
        }
    }
    return ''; //If not editing an existing local receipt item, then default to empty
}
