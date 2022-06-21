import Logger from '../Log/Logger';
import style from '../Common/Style/StyleFormCellButton';

export default function FilterOnLoaded(pageClientAPI) {
    try {
        style(pageClientAPI, 'ResetButton', 'FormCellButton');
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterReset error: ${exception}`);
    }
}
