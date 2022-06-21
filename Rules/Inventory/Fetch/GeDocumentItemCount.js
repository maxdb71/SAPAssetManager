
/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GeDocumentItemCount(clientAPI) {
    return clientAPI.localizeText('number_of_items',[clientAPI.getBindingObject().ItemCount]);
}
