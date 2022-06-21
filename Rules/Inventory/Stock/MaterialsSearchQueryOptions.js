
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialsSearchQueryOptions(context) {
    let searchString = context.searchString;
    if (searchString) {
        let queryBuilder = context.dataQueryBuilder();
        let filters = [];
        let filter = '';

        filters.push(`substringof('${searchString.toLowerCase()}', tolower(MaterialNum))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(Plant))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(StorageLocation))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(Material/Description))`);
        
        filter = '(' + filters.join(' or ') + ')';
        queryBuilder.filter(filter);
        queryBuilder.expand('Material/MaterialPlants,MaterialPlant');
        queryBuilder.orderBy('Plant asc','StorageLocation asc');

        return queryBuilder;
    }

    return '$expand=Material/MaterialPlants,MaterialPlant&$orderby=MaterialNum,Plant,StorageLocation';
}
