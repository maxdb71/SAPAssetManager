import libVal from '../../Common/Library/ValidationLibrary';
/**
* Returns true if the CalculatedCharFlag is not set
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsOnReturning(context) {
    let extension = context.getPageProxy().getControl('FormCellContainer')._control;
    if (extension.controls && extension.controls.length > 0) {
        let readLink;
        for (let i=0; i < extension.controls.length; i++) {
            if (extension.controls[i].binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' && extension.controls[i].visible) {
                if (libVal.evalIsEmpty(readLink)) {
                    readLink = extension.controls[i].binding['@odata.readLink'];
                } else if (readLink !== extension.controls[i].binding['@odata.readLink']) {
                    extension.controls[extension.controls.length -1].visible = true;
                    return;
                }
            }
        }
    }
}
