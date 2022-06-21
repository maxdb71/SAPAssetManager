import libCom from '../../Common/Library/CommonLibrary';

export default function MaterialDocumentCreateUpdateCaption(context) {
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

    if (type === 'MaterialDocument') { //Updating an existing document
        return '$(L,edit)';
    }

    if (movementType === 'R') { 
        return '$(L, receive_all_document)';
    }

    if (movementType === 'I') { 
        return '$(L, receive_all_issues)';
    }

    return '$(L,material_document_create_title)'; //Creating a new document
}
