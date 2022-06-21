import OnDateChanged from '../Common/OnDateChanged';

export default function OverviewOnPageReturning(context) {

    // Refresh the map view
    let sectionedTable = context.getControls()[0];
    let mapSection = sectionedTable.getSections()[0];
    let mapViewExtension = mapSection.getExtensions()[0];
    mapViewExtension.update();

    // Check to see if this date has changed
    let lastDateChange = context.getClientData().lastDateChange;
    let now = new Date();

    if (lastDateChange.getDate() !== now.getDate() && now > lastDateChange) {
        OnDateChanged(context);
    }

}
