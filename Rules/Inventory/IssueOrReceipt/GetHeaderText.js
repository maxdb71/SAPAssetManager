export default function GetHeaderText(context) {

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        //Issue
        if (type === 'MaterialDocItem') {
            return context.binding.AssociatedMaterialDoc.HeaderText;
        } else if (type === 'MaterialDocument') {
            return context.binding.HeaderText;
        }
        
        if (context.binding.TempHeader_HeaderText) {
            return context.binding.TempHeader_HeaderText;
        }
    }
    return ''; //If not editing an existing local receipt item, then default to empty
}
