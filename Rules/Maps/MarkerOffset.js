export default function MarkerOffset(context) {
    let priority = context.binding.Priority;
    if (priority === '1' || priority === '2') {
        return 3;
    }
    return 0;
}
