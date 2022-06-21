import inspCharLib from './InspectionCharacteristics';
import Logger from '../../Log/Logger';

export default function InspectionCharacteristicsTargetSpecification(context) {
    let binding = context.binding;
    if (inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding)) {
        try {
            let spec = binding.LowerLimit + ' ' + binding.MasterInspChar_Nav.UoM + ' - ' + binding.UpperLimit + ' ' + binding.MasterInspChar_Nav.UoM + ' (' + context.localizeText('target_value') + ' ' + binding.TargetValue +')';
            return spec;
        } catch (err) {
            Logger.error(`Failed to populate the target spec: ${err}`);
            return '-';
        }
    }
    return '-';
}
