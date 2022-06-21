
export default function StockSearchFilterResults(context) {
    
    let result1 = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:MaterialNumberFilter/#FilterValue');
    let result3 = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:PlantFilter/#FilterValue');
    let result4 = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:StorgaeLocationFilter/#FilterValue');
    let materialNumberFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:MaterialNumberFilter');
    let PlantFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:PlantFilter');
    let StorgaeLocationFilter = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:StorgaeLocationFilter');

    let filterResults = [result1, result2, result3, result4];
    let material = [];
    let plant = [];
    let storageLocation = [];
    if (materialNumberFilter.getValue().length > 0) {
        for (var i = 0; i < materialNumberFilter.getValue().length; i++) {
            material.push(materialNumberFilter.getValue()[i].ReturnValue);
        }
    }

    if (PlantFilter.getValue().length > 0) {
        for (var j = 0; j < PlantFilter.getValue().length; j++) {
            plant.push(PlantFilter.getValue()[j].ReturnValue);
        }
    }

    if (StorgaeLocationFilter.getValue().length > 0) {
        for (var k = 0; k < StorgaeLocationFilter.getValue().length; k++) {
            storageLocation.push(StorgaeLocationFilter.getValue()[k].ReturnValue);
        }
    }

    if (material.length > 0 && plant.length > 0 && storageLocation.length > 0) {
        let materialQueryOptions = '(';
        for (var a = 0; a < storageLocation.length; a++) {
            for (var b = 0; b < plant.length; b++) {
                for (var c = 0; c < material.length; c++) {
                    if (a === 0 && c === 0 && b === 0) {
                        materialQueryOptions = materialQueryOptions + `MaterialNum eq '${material[c]}' and Plant eq '${plant[b]}' and StorageLocation eq '${storageLocation[a]}'`;
                    } else {
                        materialQueryOptions = materialQueryOptions + ` or MaterialNum eq '${material[c]}' and Plant eq '${plant[b]}' and StorageLocation eq '${storageLocation[a]}'`;
                    }
                }
            }
        }
        materialQueryOptions = materialQueryOptions + ')';

        let dateFilter = [materialQueryOptions];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = materialQueryOptions;
    } else if (plant.length > 0 && storageLocation.length > 0) {
        let plantAndSlocQueryOptions = '(';
        for (var d = 0; d < storageLocation.length; d++) {
            for (var e = 0; e < plant.length; e++) {
                if (d === 0 && e === 0) {
                    plantAndSlocQueryOptions = plantAndSlocQueryOptions + `Plant eq '${plant[e]}' and StorageLocation eq '${storageLocation[d]}'`;
                } else {
                    plantAndSlocQueryOptions = plantAndSlocQueryOptions + ` or Plant eq '${plant[e]}' and StorageLocation eq '${storageLocation[d]}'`;
                }
            }
        }
        plantAndSlocQueryOptions = plantAndSlocQueryOptions + ')';

        let dateFilter = [plantAndSlocQueryOptions]; 
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = plantAndSlocQueryOptions;
    } else if (plant.length > 0) {
        let plantQueryOptions = '(';
        for (var f = 0; f < plant.length; f++) {
            if (f === 0) {
                plantQueryOptions = plantQueryOptions + `Plant eq '${plant[f]}'`;
            } else {
                plantQueryOptions = plantQueryOptions + ` or Plant eq '${plant[f]}'`;
            }
        }
        plantQueryOptions = plantQueryOptions + ')';

        let dateFilter = [plantQueryOptions];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = plantQueryOptions;
    } else if (storageLocation.length > 0) {
        let slocQueryOptions = '(';
        for (var g = 0; g < storageLocation.length; g++) {
            if (g === 0) {
                slocQueryOptions = slocQueryOptions + `StorageLocation eq '${storageLocation[g]}'`;
            } else {
                slocQueryOptions = slocQueryOptions + ` or StorageLocation eq '${storageLocation[g]}'`;
            }
        }
        slocQueryOptions = slocQueryOptions + ')';

        let dateFilter = [slocQueryOptions];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = slocQueryOptions;
    } else if (material.length > 0) {
        let materialsQueryOptions = '(';
        for (var h = 0; h < material.length; h++) {
            if (h === 0) {
                materialsQueryOptions = materialsQueryOptions + `MaterialNum eq '${material[h]}'`;
            } else {
                materialsQueryOptions = materialsQueryOptions + ` or MaterialNum eq '${material[h]}'`;
            }
        }
        materialsQueryOptions = materialsQueryOptions + ')';
        context.evaluateTargetPath('#Page:StockListViewPage/#ClientData').OfflineQueryOptions = materialsQueryOptions;
    }

    return filterResults;
}
