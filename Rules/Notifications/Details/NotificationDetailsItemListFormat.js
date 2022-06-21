import libForm from '../../Common/Library/FormatLibrary';

export default function NotificationDetailsItemListFormat(context) {
    var binding = context.getBindingObject();
    switch (context.getProperty()) {
        case 'Title':
            return libForm.getFormattedKeyDescriptionPair(context, binding.ItemNumber, binding.ItemText);
        case 'Subhead':
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='B', Code='${binding.ObjectPart}', CodeGroup='${binding.ObjectPartCodeGroup}')`, [], '').then(function(data) {
                if (data && data.length > 0) {
                    return data.getItem(0).CodeDescription;
                } else {
                    return '';
                }
            });
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='C', Code='${binding.DamageCode}', CodeGroup='${binding.CodeGroup}')`, [], '').then(function(codeData) {
                if (codeData && codeData.length > 0) {
                    return libForm.getFormattedKeyDescriptionPair(context, binding.DamageCode, codeData.getItem(0).CodeDescription);
                } else {
                    return context.localizeText('no_damage_code_specified');
                }
            });
        case 'StatusText':
            return binding.ObjectPartCodeGroup;
        default:
            return '';
    }
}
