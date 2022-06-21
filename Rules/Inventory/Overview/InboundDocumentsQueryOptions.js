import inboundQuery from '../Inbound/GetInboundListQuery';

//var localeStorage = require('nativescript-localstorage');

export default function InboundDocumentsQueryOptions(clientAPI) {
    // let numberOfVisibleItems = localeStorage.getItem('numberOfPreviewItemsOnOverview');
    let numberOfVisibleItems = clientAPI.nativescript.appSettingsModule.getNumber('numberOfPreviewItemsOnOverview');
    if (!numberOfVisibleItems) {
        numberOfVisibleItems = 5; // hardcoded
    }

    let query = inboundQuery(clientAPI, true);
    if (numberOfVisibleItems) {
        return query + '&$top=' + numberOfVisibleItems.toString();
    } else {
        return query + '&$top=1';
    }
}
