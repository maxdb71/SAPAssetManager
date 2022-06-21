/**
* @return<String> a GUID value
*/
export function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	let value = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4();
	return value.toUpperCase();
}
