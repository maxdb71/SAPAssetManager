import libCommon from '../../Common/Library/CommonLibrary';
import lamIsEnabled from '../../LAM/LAMIsEnabled';

export default function ConfirmationCreateUpdateNav(context, override, defaultStart = new Date(), defaultEnd = new Date()) {

    let mConfirmation = {
        '_Start': defaultStart,
        '_End': defaultEnd,
        'IsOnCreate': true,
        'IsWorkOrderChangable': true,
        'IsOperationChangable': true,
        'IsSubOperationChangable': true,
        'IsDateChangable': true,
        'IsFinalChangable': true,
        'SubOperation': '',
        'VarianceReason': '',
        'AccountingIndicator': '',
        'ActivityType': '',
        'Description': '',
        'Operation': '',
        'OrderID': '',
        'Plant': '',
        'IsFinal': false,
        'WorkOrderHeader': undefined,
        'name': 'mConfirmation',
        '_Posting': defaultStart,
    };

    if (override) {
        for (const [key, value] of Object.entries(override)) {
            mConfirmation[key] = value;
        }
    }

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);

    if (context.constructor.name === 'SectionedTableProxy') {
        context.getPageProxy().setActionBinding(mConfirmation);
    } else {
        context.setActionBinding(mConfirmation);
    }
    ///CreateUpdateConfirmation needs confirmation args in client data
    context.getClientData().confirmationArgs = mConfirmation;
    libCommon.removeStateVariable(context, 'LAMConfirmationNum');
    libCommon.removeStateVariable(context, 'LAMConfirmationCounter');
    libCommon.removeStateVariable(context, 'LAMDefaultRow');
    libCommon.removeStateVariable(context, 'LAMCreateType');
    libCommon.removeStateVariable(context, 'LAMConfirmationReadLink');
    libCommon.removeStateVariable(context, 'LAMSignature'); //Set to true before displaying signature screen during confirmation add
    libCommon.removeStateVariable(context, 'LAMConfirmCreate');  //Set to true if confirmation LAM entry needs to be deferred until after signature entry
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreateChangeset.action').then(() => {
        if (lamIsEnabled(context)) {
            //Check to see if the confirmation we just added needs a LAM entry created
            libCommon.setStateVariable(context, 'LAMDefaultRow', '');
            let confirm = libCommon.getStateVariable(context, 'LAMConfirmationNum');
            let counter = libCommon.getStateVariable(context, 'LAMConfirmationCounter');
            if (confirm) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', [], "$filter=ConfirmationNum eq '" + confirm + "' and ConfirmationCounter eq '" + counter + "'").then(function(results) {
                    if (results && results.length > 0) {
                        let confirmRow = results.getItem(0);
                        let op = confirmRow.Operation;
                        let order = confirmRow.OrderID;
                        let lamDefaultRow = '', tempRow;
                        //Read the operation row and its parent WO.  Work up the hierarchy looking for the first LAM record to use as a default
                        let expand = '$expand=LAMObjectDatum_Nav,EquipmentOperation,FunctionalLocationOperation,EquipmentOperation/LAMObjectDatum_Nav,FunctionalLocationOperation/LAMObjectDatum_Nav,WOHeader,WOHeader/LAMObjectDatum_Nav,WOHeader/Equipment,WOHeader/Equipment/LAMObjectDatum_Nav,WOHeader/FunctionalLocation,WOHeader/FunctionalLocation/LAMObjectDatum_Nav';
                        return context.read('/SAPAssetManager/Services/AssetManager.service', "MyWorkOrderOperations(OperationNo='" + op + "',OrderId='" + order + "')", ['OperationNo'], expand).then(function(opResults) {
                            if (opResults && opResults.length > 0) {
                                let opRow = opResults.getItem(0);
                                if (opRow.LAMObjectDatum_Nav && opRow.LAMObjectDatum_Nav.StartPoint !== '' && opRow.LAMObjectDatum_Nav.EndPoint !== '' && opRow.LAMObjectDatum_Nav.Length !== '') { // Ignore bogus LAM entries
                                    lamDefaultRow = opRow.LAMObjectDatum_Nav;
                                } else if (opRow.EquipmentOperation && opRow.EquipmentOperation.LAMObjectDatum_Nav) {
                                    lamDefaultRow = opRow.EquipmentOperation.LAMObjectDatum_Nav;
                                } else if (opRow.FunctionalLocationOperation && opRow.FunctionalLocationOperation.LAMObjectDatum_Nav) {
                                    lamDefaultRow = opRow.FunctionalLocationOperation.LAMObjectDatum_Nav;
                                } else if (opRow.WOHeader && opRow.WOHeader.LAMObjectDatum_Nav && opRow.WOHeader.LAMObjectDatum_Nav.length > 0) {
                                    for (var i = 0; i < opRow.WOHeader.LAMObjectDatum_Nav.length; i++) {
                                        tempRow = opRow.WOHeader.LAMObjectDatum_Nav[i];
                                        if (tempRow.ObjectType === 'OR' && tempRow.StartPoint !== '' && tempRow.EndPoint !== '' && tempRow.Length !== '') { //Find the header row, Ignore bogus LAM entries
                                            lamDefaultRow = tempRow;
                                            break;
                                        }
                                    }
                                }
                                if (!lamDefaultRow) {
                                    if (opRow.WOHeader && opRow.WOHeader.Equipment && opRow.WOHeader.Equipment.LAMObjectDatum_Nav) {
                                        lamDefaultRow = opRow.WOHeader.Equipment.LAMObjectDatum_Nav;
                                    } else if (opRow.WOHeader && opRow.WOHeader.FunctionalLocation && opRow.WOHeader.FunctionalLocation.LAMObjectDatum_Nav) {
                                        lamDefaultRow = opRow.WOHeader.FunctionalLocation.LAMObjectDatum_Nav;
                                    }
                                }
                            }
                            if (lamDefaultRow) { //We found a LAM default, so create a new LAM entry for this confirmation
                                libCommon.setStateVariable(context, 'LAMDefaultRow', lamDefaultRow);
                                libCommon.setStateVariable(context, 'LAMCreateType', 'Confirmation');
                                libCommon.setStateVariable(context, 'LAMConfirmationReadLink', confirmRow['@odata.readLink']);
                                libCommon.setStateVariable(context, 'TransactionType', 'CREATE');
                                let signature = libCommon.getStateVariable(context, 'LAMSignature');
                                if (signature) { //We are capturing a signature first, so defer this action until later
                                    libCommon.removeStateVariable(context, 'LAMSignature');
                                    libCommon.setStateVariable(context, 'LAMConfirmCreate', true);
                                    return Promise.resolve(false);
                                }
                                return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
                            }
                            return Promise.resolve(true);
                        });
                    }
                    return Promise.resolve(false);
                });
            }
            return Promise.resolve(false);
        }
        return Promise.resolve(false);
    });
}

