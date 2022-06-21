import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsValidateOrCalculateIsEditable(context) {
    let binding = context.binding;
    if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        return true;
    } else if (inspCharLib.isQuantitative(binding)) {
        return true;
    }
    return false;
}
