import CommonLibrary from './Library/CommonLibrary';

export default function IsPhaseModelEnabled(context) {
    return CommonLibrary.getAppParam(context, 'EAM_PHASE_MODEL', 'Enable') === 'Y';
}
