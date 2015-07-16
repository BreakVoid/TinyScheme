exports.IsIdentifier = function(str) {
	for (var i = 0; i < str.length; ++i) {
		if (str[i] < '0' || str[i] > '9') {
			return true;
		}
	}
	return false;
}

exports.GetSentences = function(str) {
	var result = [];
	var content = "";
	var lefcnt = 0;
	for (var i = 0; i < str.length; ++i) {
		if (lefcnt == 0 && str[i] == '(') {
			lefcnt = 1;
			content = "(";
		} else if (lefcnt == 1 && str[i] == ')') {
			result.push(content + ')');
			lefcnt = 0;
			content = "";
		} else {
			content += str[i];
			if (str[i] == '(') {
				++lefcnt;
			} else if (str[i] == ')') {
				--lefcnt;
			}
		}
	}
	return result;
}

exports.genUUID = function (){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};