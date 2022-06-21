import outboundQuery from '../Outbound/GetOutboundListQuery';

// var localeStorage = require('nativescript-localstorage');

export default function OutboundDocumentsQueryOptions(context) {
    // let numberOfVisibleItems = localeStorage.getItem('numberOfPreviewItemsOnOverview');
    let numberOfVisibleItems = context.nativescript.appSettingsModule.getNumber('numberOfPreviewItemsOnOverview');
    if (!numberOfVisibleItems) {
        numberOfVisibleItems = 5; // hardcoded
    }
    
    let query = outboundQuery(context, true);
    if (numberOfVisibleItems) {
        return query + '&$top=' + numberOfVisibleItems.toString();
    } else {
        return query + '&$top=1';
    }
}
