export default function BOMVisible(context) {
    if (context.binding.BoMFlag === 'X') {
        return true;
    }
    return false;
}
