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
			result.push(content.trim() + ')');
			lefcnt = 0;
			content = "";
		} else {
			if (str[i] == '\r') {
				continue;
			} else if (str[i] == '\n') {
				content += " ";
			} else {
				content += str[i];
			}
			if (str[i] == '(') {
				++lefcnt;
			} else if (str[i] == ')') {
				--lefcnt;
			}
		}
	}
	return result;
}

exports.GetType = function(str) {
	var isNumber = true;
	var offset = 0;
	var floatPoint = false;
	if (str[0] == '-') {
		offset = 1;
	}
	for (var i = offset; i < str.length; ++i) {
		if (str[i] == '.') {
			if (floatPoint) {
				isNumber = false;
				break;
			} else {
				floatPoint = true;
			}
		} else {
			if (str[i] < '0' || str[i] > '9') {
				isNumber = false;
				break;
			}
		}
	}
	if (isNumber) {
		if (floatPoint) {
			return "number-float";
		} else {
			return "number-integer";
		}
	}
	if (str[0] == '"' && str[str.length - 1] == '"') {
		return "string"
	}
	if (str[0] == '(' && str[str.length - 1] == ')') {
		return "procedure";
	}
	return "identifier";
}

exports.GetElements = function(str) {
	console.log(str);
	var result = [];
	var content = "";
	var lefcnt = 0;
	for (var i = 0; i < str.length; ++i) {
		if (lefcnt == 0) {
			if (str[i] == ' ' || str[i] == '\n' || str[i] == '\r' || str[i] == '\t') {
				if (content != "") {
					var trimed_content = content.trim();
					var item = {content : trimed_content};
					item["type"] = exports.GetType(item.content);
					result.push(item);
					content = "";
				}
			} else {
				content += str[i];
				if (str[i] == '(') {
					lefcnt = 1;
				}
			}
		} else {
			if (str[i] == ')') {
				content += str[i];
				--lefcnt;
				if (lefcnt == 0) {
					var trimed_content = content.trim();
					var item = {content : trimed_content};
					item["type"] = exports.GetType(item.content);
					result.push(item);
					content = "";
				}
				continue;
			} else if (str[i] == '\n') {
				content += ' ';
			} else if (str[i] == 'r') {
				continue;
			} else if (str[i] == '\t') {
				content += ' ';
			} else {
				content += str[i];
			}
		}
	}
	if (content != "") {
		var trimed_content = content.trim();
		var item = {content : trimed_content};
		item["type"] = exports.GetType(item.content);
		result.push(item);
	}
	return result;
}

exports.genUUID = function (){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};