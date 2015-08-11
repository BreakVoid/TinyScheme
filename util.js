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
	var inComment = false;
	for (var i = 0; i < str.length; ++i) {
		if (inComment) {
			if (str[i] == '\n') {
				inComment = false;
				continue;
			}
		}
		if (str[i] == ';') {
			inComment = true;
			continue;
		}
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
	var digitExisted = false;
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
			} else {
				digitExisted = true;
			}
		}
	}
	if (isNumber && digitExisted) {
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

function isEmptyChar(ch) {
	if (ch == " " || ch == '\n' || ch == '\t' || ch == '\r') {
		return true;
	} else {
		return false;
	}
}

exports.isInteger = function(str) {
	var offset = 0;
	if (str[0] == '-') {
		offset = 1;
	}
	for (var i = offset; i < str.length; ++i) {
		if (str[i] > '9' || str[i] < '0') {
			return false;
		}
	}
	return str.length > offset;
}

exports.isFloatNumber = function(str) {
	var offset = 0;
	var floatPoint = false;
	if (str[0] == '-') {
		offset = 1;
	}
	for (var i = offset; i < str.length; ++i) {
		if (str[i] == '.') {
			if (floatPoint) {
				return false;
			} else {
				floatPoint = true;
			}
		} else {
			if (str[i] > '9' || str[i] < '0') {
				return false;
			}
		}
	}
	return str.length > offset;
}

function GetElement(str) {
	var trimed_str = str.trim();
	var content;
	if (trimed_str[0] == '\"' && trimed_str[trimed_str.length - 1] == '\"') {
		content = trimed_str.slice(1, trimed_str.length - 1);
		return {
			"type" : "string",
			"content" : content
		};
	} else if (trimed_str[0] == '(' && trimed_str[trimed_str.length - 1] == ')') {
		return {
			"type" : "procedure",
			"content" : trimed_str
		};
	} else if (trimed_str[0] == '\'') {
		return {
			"type" : "procedure",
			"content" : "(quote " + trimed_str.slice(1, trimed_str.length) + ')'
		};
	} else if (exports.isInteger(trimed_str)) {
		return {
			"type" : "number-integer",
			"content" : trimed_str
		};
	} else if (exports.isFloatNumber(trimed_str)) {
		return {
			"type" : "number-float",
			"content" : trimed_str
		};
	} else {
		return {
			"type" : "identifier",
			"content" : trimed_str
		};
	}
}

exports.GetElements = function(str) {
	var result = [];
	var content = "";
	var inquote = false;
	var roundBracketCnt = 0;
	for (var i = 0; i < str.length; ++i) {
		if (inquote) {
			content += str[i];
			if (str[i] == '\"') {
				inquote = false;
			}
		} else {
			if (roundBracketCnt > 0) {
				if ((i == 0 && isEmptyChar(str[i])) || (i > 0 && isEmptyChar(str[i]) && isEmptyChar(str[i - 1]))) {
					continue;
				}
				if (isEmptyChar(str[i])) {
					content += " ";
				} else {
					content += str[i];
					if (str[i] == '(') {
						++roundBracketCnt;
					} else if (str[i] == ')') {
						--roundBracketCnt;
						if (roundBracketCnt == 0) {
							result.push(GetElement(content));
							content = "";
						}
					}
				}
			} else {
				if (isEmptyChar(str[i])) {
					if ((i == 0 && isEmptyChar(str[i])) || (i > 0 && isEmptyChar(str[i]) && isEmptyChar(str[i - 1]))) {
						continue;
					}
					if (content == "") {
						continue;
					}
					result.push(GetElement(content));
					content = "";
				} else {
					content += str[i];
					if (str[i] == '\"') {
						inquote = true;
					} else if (str[i] == '(') {
						++roundBracketCnt;
					}
				}
			}
		}
	}
	if (content.trim() != "") {
		result.push(GetElement(content));
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