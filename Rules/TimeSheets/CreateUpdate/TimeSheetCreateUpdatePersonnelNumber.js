export default function TimeSheetCreateUpdatePersonnelNumber(clientAPI) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', [], '')
        .then(function(result) {
            var perNo = '';
            if (result && result.length > 1) {
                result.forEach(function(element) {
                    if (element.SystemSettingName === 'PERNO') {
                        perNo = element.SystemSettingValue;
                    }
                });
            }
            return perNo;
        });
}
