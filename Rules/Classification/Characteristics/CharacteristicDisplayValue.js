/**
 * This function will query the object level characteristics to show them on the 
 * list view. It will first push them into an array with their respective unit of
 * measure and then pretty print them by simply joining them
 * 
 */

import charValue from './CharacteristicValue';
import Logger from '../../Log/Logger';
import parentEntityType from '../ClassificationParentEntityType';
import prettyPrint from './ClassificationCharacteristicsPrettyPrint';
export default function CharacteristicDisplayValue(context, withUOM=true) {
    var charValues = [];
    if (parentEntityType(context) === 'Equipments') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipClassCharValues', [], '$filter=EquipId eq \'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipId + '\' and CharId eq \'' + context.binding.Characteristic.CharId + '\'&$orderby=CharId,EquipId').then(function(results) {
            for (var i = 0; i < results.length; i++) {
                charValues.push(charValue(context, results.getItem(i), withUOM));
            }
            return prettyPrint(charValues);
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
            return charValues;
        });
    } else if (parentEntityType(context) === 'FunctionalLocations') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFuncLocClassCharValues', [], '$filter=FuncLocIdIntern eq \'' + context.evaluateTargetPathForAPI('#Page:-Previous').binding.FuncLocIdIntern + '\' and CharId eq \'' + context.binding.Characteristic.CharId + '\'&$orderby=CharId,FuncLocIdIntern').then(function(results) {
            for (var i = 0; i < results.length; i++) {
                charValues.push(charValue(context, results.getItem(i), withUOM));
            }
            return prettyPrint(charValues);
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
            return charValues;
        });
    }
    return charValues;
}
