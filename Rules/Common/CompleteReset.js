import libCom from './Library/CommonLibrary';
import personalLib from '../Persona/PersonaLibrary';

export default function CompleteReset(clientAPI) {
    if (personalLib.isMaintenanceTechnician(clientAPI)) {
        let pageProxy = clientAPI.evaluateTargetPathForAPI('#Page:OverviewPage');
        let sectionedTable = pageProxy.getControls()[0];
        if (libCom.isDefined(sectionedTable)) {
            let mapSection = sectionedTable.getSections()[0];
            if (libCom.isDefined(mapSection)) {
                let mapViewExtension = mapSection.getExtensions()[0];
                if (libCom.isDefined(mapViewExtension)) {
                    mapViewExtension.clearUserDefaults();
                }
            }
        }
    }
    // Changing the flag back to false to execute Update action again on subsequent reset
    clientAPI.nativescript.appSettingsModule.setBoolean('didSetUserGeneralInfos', false);
    clientAPI.nativescript.appSettingsModule.setBoolean('initialSync', true);
       
}
