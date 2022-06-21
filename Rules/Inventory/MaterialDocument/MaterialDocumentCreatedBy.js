export default function MaterialDocumentCreatedBy(context) {
    //return context.localizeText('created_by',[context.getBindingObject().UserName]);
    return context.getBindingObject().UserName;
}
