
import libCom from '../Common/Library/CommonLibrary';
import libLocal from '../Common/Library/LocalizationLibrary';

export default function LAMValuePointChanged(context) {
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    let length = 0;


    if (libLocal.isNumber(context, start) && libLocal.isNumber(context, end)) {
        length = libLocal.toNumber(context, end) - libLocal.toNumber(context, start);
        controls.Length.setValue(context.formatNumber(length));
    }
}
