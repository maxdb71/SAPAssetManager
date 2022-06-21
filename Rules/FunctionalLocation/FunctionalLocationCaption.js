import count  from '../FunctionalLocation/FunctionalLocationCount';

export default function FunctionalLocationCaption(context) {
    return count(context).then(result => {
        return context.localizeText('function_location_caption', [result]);
     });
}
