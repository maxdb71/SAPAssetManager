export default function GetDocumentDate(context) {

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let date;

        if (type === 'MaterialDocItem') {
            date = context.binding.AssociatedMaterialDoc.DocumentDate;
        } else if (type === 'MaterialDocument') {
            date = context.binding.DocumentDate;
        }

        if (context.binding.TempHeader_DocumentDate) {
            date = context.binding.TempHeader_DocumentDate;
        }

        if (date) {
            let offset = new Date().getTimezoneOffset() * 60 * 1000; 
            if (offset < 0) {
                return new Date(new Date(date).getTime() - offset);
            }
            return new Date(new Date(date).getTime() + offset);
        }
    }

    return ''; //Default to now if creating a new header
}
