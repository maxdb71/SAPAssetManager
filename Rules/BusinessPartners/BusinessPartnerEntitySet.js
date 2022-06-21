export default function BusinessPartnerEntitySet(context) {
    if (typeof context.getPageProxy === 'function') {
        context = context.getPageProxy();
    }
    let entitySet = context.binding['@odata.readLink'] + '/Partners';
    return entitySet;
}
