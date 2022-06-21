import ComLib from '../../Common/Library/CommonLibrary';

export default function DocumentOnCreateObjectLink(controlProxy) {
    let value = ComLib.getAppParam(controlProxy,'DOCUMENT',ComLib.getStateVariable(controlProxy, 'Class'));
    if (value) {
        return value;
    } else {
        return '';
    }
}
