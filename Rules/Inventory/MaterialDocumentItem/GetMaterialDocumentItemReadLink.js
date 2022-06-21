export default function GetMaterialDocumentItemReadLink(context) {
    if (context.binding.TempLine_MatDocItemReadLink) {
        return context.binding.TempLine_MatDocItemReadLink;
    }
    //Get the material document item key for updating during create related entity action
    return "MaterialDocItems(MatDocItem='" + context.binding.TempItem_Key + "',MaterialDocNumber='" + context.binding.TempHeader_Key + "',MaterialDocYear='" + context.binding.TempHeader_MaterialDocYear + "')";

}
