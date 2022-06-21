import libCom from '../../../Common/Library/CommonLibrary';

export default function TimeSheetEntryCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    return clientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
}
