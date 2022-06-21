/**
 * 
 * Return the header text + delivery note for display on material document lists 
 */
export default function GetHeaderTextPlusDeliveryNote(context) {

    let binding = context.binding;
    let result = '';
    
    if (binding.HeaderText) {
        result = binding.HeaderText;
    }
    if (binding.RefDocumentNumber) {
        if (result) {
            result += ' - ' + binding.RefDocumentNumber;
        } else {
            result = binding.RefDocumentNumber;
        }
    }

    return result;
}
