import DocumentActionBinding from './DocumentActionBinding';
export default function DocumentStreamReadLink(pageProxy) {
    let actionBinding = DocumentActionBinding(pageProxy);
    let documentobject = actionBinding.Document ? actionBinding.Document : actionBinding.PRTDocument;
    return documentobject['@odata.readLink'];
}
