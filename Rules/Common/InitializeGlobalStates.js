import Logger from '../Log/Logger';
import GenerateAssnTypeTable from './GenerateAssnTypeTable';
import assignmentType from './Library/AssignmentType';
import InitDefaultOverviewRows from '../Confirmations/Init/InitDefaultOverviewRows';
import InitDemoOverviewRows from '../TimeSheets/Demo/InitDemoOverviewRows';
import { GlobalVar as GlobalClass } from './Library/GlobalCommon';
import { ItemCategoryVar as GlobalItemCategory } from './Library/GlobalItemCategory';
import { PartnerFunction } from './Library/PartnerFunction';
import common from './Library/CommonLibrary';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';
import deviceRegistration from '../DigitalSignature/TOTPDeviceRegistration';
import removeHeader from '../ApplicationEvents/RemoveHeader';
import libPersona from '../Persona/PersonaLibrary';
export function DeltaSyncInit(pageProxy) {

    let appParamRead = pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'AppParameters', ['ParamGroup','ParamValue', 'ParameterName'], '').then(appParams => {
            let result = Object();
            for (let i = 0; i < appParams.length; i ++) {
                let param = appParams.getItem(i);
                if (!result[param.ParamGroup]) {
                    result[param.ParamGroup] = Object();
                }
                result[param.ParamGroup][param.ParameterName] = param.ParamValue;
            }
            GlobalClass.setAppParam(result);

            //set Sold-To-Party PartnerFunction
            let soldToPartnerType = GlobalClass.getAppParam().PARTNERFUNCTION.SoldToParty;
            pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'PartnerFunctions', [], `$filter=PartnerType eq '${soldToPartnerType}'`).then(PF => {
                if (PF && PF.getItem(0)) {
                    PartnerFunction.setSoldToPartyPartnerFunction(PF.getItem(0).PartnerFunction);
                } else {
                    PartnerFunction.setSoldToPartyPartnerFunction('');
                }
            });

            //set Personel Number PartnerFunction
            let personelPartnerType = GlobalClass.getAppParam().PARTNERFUNCTION.PersonelNumber;
            pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'PartnerFunctions', [], `$filter=PartnerType eq '${personelPartnerType}'`).then(PF => {
                if (PF && PF.getItem(0)) {
                    PartnerFunction.setPersonnelPartnerFunction(PF.getItem(0).PartnerFunction);
                } else {
                    PartnerFunction.setPersonnelPartnerFunction('');
                }
            });
        });

    let userSysRead = pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', ['SystemSettingName', 'SystemSettingValue'], '')
        .then(userProfile => {
            let result = new Map(userProfile.map((i) => [i.SystemSettingName, i.SystemSettingValue]));
            common.setStateVariable(pageProxy, 'UserSystemInfos', result);
            GlobalClass.setUserSystemInfo(result);
        });

    let userGenRead = pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(userGeneralInfo => {
        if (userGeneralInfo && userGeneralInfo.length > 0) {
            let row = userGeneralInfo.getItem(0);
            GlobalClass.setUserGeneralInfo(row);
        }
    });

    let itemCategoryRead = pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'ItemCategories', [], '').then(itemCategoriesInfo => {
        let categories = Object();
        if (itemCategoriesInfo && itemCategoriesInfo.length > 0) {
            for (let i = 0; i < itemCategoriesInfo.length; i ++) {
                categories[itemCategoriesInfo.getItem(i).ItemCategory] = itemCategoriesInfo.getItem(i).ItemCategoryDesc;
            }
        }
        GlobalItemCategory.setItemCategories(categories);
    });


    return Promise.all([appParamRead, userSysRead, userGenRead, itemCategoryRead]).then(() => {
        let overviewPageName = libPersona.getPersonaOverviewStateVariablePage(pageProxy);
		let overviewPage = pageProxy.evaluateTargetPathForAPI('#Page:' + overviewPageName);
		if (overviewPage && overviewPage.getControls().length > 0) {
			overviewPage.getControls()[0].redraw();
		}
        return true;
    }).catch((err) => {
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(),`Failed to initialize global states : ${err}`);
        return false;
    });
}

export default function InitializeGlobalStates(pageProxy) {

    
    /**** Instantiate global state variables *****/
    /* We will keep these small tables in memory for easy access, rather than reading from the offline store each time they are needed
    */

    return DeltaSyncInit(pageProxy).then(() => {
        // Remove User Switch Header if present
        removeHeader(pageProxy, 'UserSwitch');
        // Generate Workorder Control Defaults Table
        let WOAssnTypeTable = GenerateAssnTypeTable(pageProxy, 'WorkOrder');
        assignmentType.setWorkOrderAssignmentDefaults(WOAssnTypeTable);
        //Initialized the overview rows promises
        let initOverviewRows =  InitDefaultOverviewRows(pageProxy);
        let initDemoOverviewRows = InitDemoOverviewRows(pageProxy);
        //let successMessage = pageProxy.executeAction('/SAPAssetManager/Actions/ApplicationStartupMessage.action');
        //Execute all promises and register for push afterwards
        return Promise.all([initOverviewRows, initDemoOverviewRows]).then(() => {
                return handleDigitalSignatureRegistration(pageProxy).then(() => {
                    return handlePush(pageProxy);
                }).catch(() => {
                    return handlePush(pageProxy);
                });
        }).catch(() => {
            return handleDigitalSignatureRegistration(pageProxy).then(() => {
                return handlePush(pageProxy);
            }).catch(() => {
                return handlePush(pageProxy);
            });
        });
    });
}

export function handlePush(context) {
    if (!context.isDemoMode()) {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationRegister.action').catch(() => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue() , 'Failed to register for Push notifications');
            return Promise.resolve(false);
        });
    } else {
        return Promise.resolve(true);
    }
}

export function handleDigitalSignatureRegistration(context) {
    if (!context.isDemoMode() && libDigSig.isDigitalSignatureEnabled(context) && common.isInitialSync(context)) {
        context.dismissActivityIndicator();
        return deviceRegistration(context);     
    } else {
        context.dismissActivityIndicator();
        return Promise.resolve();
    }
}
