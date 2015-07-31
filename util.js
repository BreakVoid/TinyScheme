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
	var roundBracketCnt = 0;
	for (var i = 0; i < str.length; ++i) {
		if (roundBracketCnt == 0 && str[i] == '(') {
			roundBracketCnt = 1;
			content = "(";
		} else if (roundBracketCnt == 1 && str[i] == ')') {
			result.push(content.trim() + ')');
			roundBracketCnt = 0;
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
				++roundBracketCnt;
			} else if (str[i] == ')') {
				--roundBracketCnt;
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
	if (str[0] == '\'') {
		return "text-value";
	}
	return "identifier";
}

exports.GetElements = function(str) {
	var result = [];
	var content = "";
	var roundBracketCnt = 0;
	var needAppend = 0;
	var quoteCnt = 0;
	for (var i = 0; i < str.length; ++i) {
		if (quoteCnt) {
			content += str[i];
			if (str[i] == "\"") {
				quoteCnt = 0;
			}
			continue;
		}
		if (str[i] == '\"') {
			content += str[i];
			quoteCnt = 1;
			continue;
		}
		if (roundBracketCnt == 0) {
			if (str[i] == '\'') {
				content += "(quote ";
				++needAppend;
				continue;
			}
			if (str[i] == ' ' || str[i] == '\n' || str[i] == '\r' || str[i] == '\t') {
				if (i == 0 || str[i - 1] == ' ' || str[i - 1] == '\n' || str[i - 1] == '\r' || str[i - 1] == '\t' ) {
					continue;
				}
				if (content != "") {
					var trimed_content = content.trim();
					while (needAppend > 0) {
						--needAppend;
						trimed_content += ")";
					}
					var item = {content : trimed_content};
					item["type"] = exports.GetType(item.content);
					result.push(item);
					content = "";
				}
			} else {
				content += str[i];
				if (str[i] == '(') {
					++roundBracketCnt;
				}
			}
		} else {
			if (str[i] == '(') {
				content += str[i];
				++roundBracketCnt;
			} else if (str[i] == ')') {
				content += str[i];
				--roundBracketCnt;
				if (roundBracketCnt == 0) {
					var trimed_content = content.trim();
					while (needAppend > 0) {
						--needAppend;
						trimed_content += ")";
					}
					var item = {content : trimed_content};
					item["type"] = exports.GetType(item.content);
					result.push(item);
					content = "";
				}
				continue;
			} else if (str[i] == '\n') {
				content += ' ';
			} else if (str[i] == '\r') {
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
		while (needAppend > 0) {
			--needAppend;
			trimed_content += ")";
		}
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

exports.clone = function(objectToBeCloned) {
 	// Basis.
  	if (!(objectToBeCloned instanceof Object)) {
   		return objectToBeCloned;
  	}

  	var objectClone;

  	var Constructor = objectToBeCloned.constructor;
  	switch (Constructor) {
    	case RegExp:
      		objectClone = new Constructor(objectToBeCloned);
      		break;
    	case Date:
      		objectClone = new Constructor(objectToBeCloned.getTime());
      		break;
    	default:
      		objectClone = new Constructor();
  	}

  	for (var prop in objectToBeCloned) {
	    objectClone[prop] = objectToBeCloned[prop];
  	}
  	return objectClone;
}

exports.DisplayRecursively = function(lst) {
	if (lst.content.length == 0) {
		return "()";
	}
	var result = "(";
	for (var i = 0; i < lst.content.length - 1; ++i) {
		if (lst.content[i].type == "list") {
			result += exports.DisplayRecursively(lst.content[i]) + " ";
		} else {
			result += lst.content[i].content + " ";
		}
	}
	if (lst.content[lst.content.length - 1].type == "list") {
		result += exports.DisplayRecursively(lst.content[lst.content.length - 1]) + ")";
	} else {
		result += lst.content[lst.content.length - 1].content + ")";
	}
	return result;
}