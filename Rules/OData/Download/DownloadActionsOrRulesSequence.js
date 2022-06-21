import allSyncronizationGroups from '../DefiningRequests/AllSyncronizationGroups';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function DownloadActionsOrRulesSequence(context) {
    let initializeAction = '/SAPAssetManager/Actions/OData/InitializeOfflineOData.action';
    let errorAction = '/SAPAssetManager/Actions/OData/InitializeOfflineODataFailureMessage.action';
    let initialSync = libCom.isInitialSync(context);
    let userSwitchDeltaCompleted =  context.nativescript.appSettingsModule.getBoolean('didUserSwitchDeltaCompleted');
    if (!(libVal.evalIsEmpty(userSwitchDeltaCompleted) || userSwitchDeltaCompleted)) { // dont do any download if user switch delta is in progress
        return [];
    }
    if (!initialSync) {
        return [ 
        {
            'Rule': '/SAPAssetManager/Rules/Persona/LoadPersonaOverview.js',
            'Caption': '',
        },
        {
            'Action': initializeAction,
            'Properties': {
                'DefiningRequests': allSyncronizationGroups(context),
                'OnFailure': errorAction,
            },
            'Caption': context.localizeText('application_initialization'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/Common/InitializeGlobalStates.js',
            'Caption': context.localizeText('Initializing_globals'),
        },
        {
            'Action': '/SAPAssetManager/Actions/ApplicationStartupMessage.action',
            'Caption': '',
        }];
    }

    return [
        {
            'Rule': '/SAPAssetManager/Rules/Persona/GetUserPersonas.js',
            'Caption': context.localizeText('initializing_personas'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/Persona/LoadPersonaOverview.js',
            'Caption': '',
        },
        {
            'Action': initializeAction,
            'Properties': {
                'DefiningRequests': allSyncronizationGroups(context),
                'OnFailure': errorAction,
            },
            'Caption': context.localizeText('application_initialization'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/Common/InitializeGlobalStates.js',
            'Caption': context.localizeText('Initializing_globals'),
        },
        {
            'Action': '/SAPAssetManager/Actions/ApplicationStartupMessage.action',
            'Caption': '',
        },
    ];
}
