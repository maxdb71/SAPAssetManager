//import ObjectListsCount from './ObjectListsCount';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * Checks to see if there are any object lists for a work order or for an operation. It's called from operation detail page and work order detail page.
 * @param {*} pageProxy Its binding object should either be a Work Order or Operation object.
 */
export default function ObjectListsExists(pageProxy) {    
    //currentObject is either a WorkOrder or Operation. 
    let currentObject = pageProxy.binding;
    if (!ValidationLibrary.evalIsEmpty(currentObject)) {
        if (!ValidationLibrary.evalIsEmpty(currentObject.WOObjectList_Nav)) {
            return true;
        }
    }
    return false;

    /**
     * Keep this code for now. 2-4-2020.
     * We might need to use this code instead to check if object lists exists if performance is an issue due to having too many expands on the get my work order queries.
     */
    // ObjectListsCount(pageProxy).then(count => {
    //     if (count > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // });
}
