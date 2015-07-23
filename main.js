var crunch = require("number-crunch");
var util = require("./util.js");

var memPool = {};
var identifier = {};
var TRUE_ID = util.genUUID();
var FALSE_ID = util.genUUID();

memPool[TRUE_ID] = {
	"type" : "boolean",
	"content" : true
};
memPool[FALSE_ID] = {
	"type" : "boolean",
	"content" : false
};

ProcessParas = function(raw_paras, curScope) {}

function ProcExec(str, curScope) {
	// console.log("function ProcExec called");
	// console.log(str);
	var paras = util.GetElements(str.slice(1, str.length - 1));
	// console.log(paras);
	var procedureName = paras[0].content;
	if (curScope[procedureName].type == "syntax") {
		return curScope[procedureName]["exec"](paras.slice(1, paras.length), curScope);
	} else if (curScope[procedureName].type == "function") {
	}
}

ProcessParas = function(raw_paras, curScope) {
	// console.log("function ProcessParas called");
	// console.log(raw_paras);
	var result = [];
	for (var i = 0; i < raw_paras.length; ++i) {
		if (raw_paras[i].type == "procedure") {
			result.push(ProcExec(raw_paras[i].content, curScope));
		} else if (raw_paras[i].type == "identifier") {
			result.push(memPool[curScope[raw_paras[i].content]["uuid"]]);
		} else {
			result.push(raw_paras[i]);
		}
	}
	return result;
}

identifiers = {
	"#t" : {
		"type" : "identifier",
		"uuid" : TRUE_ID
	},
	"#f" : {
		"type" : "identifier",
		"uuid" : FALSE_ID
	},
	"define" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			var result = { type : "define-result" };
			if (paras[0].type == 'procedure') {
				result.content_type = "function";
				result.scope = curScope;
				result.body = paras.slice(1, paras.length);
				var functionForm = util.GetElements(paras[0].content.slice(1, paras[0].content.length - 1));
				// console.log(functionForm);
				result.name = functionForm[0].content;
				result.paraList = functionForm.slice(1, functionForm.length);
			} else {
				result.content_type = util.GetType(paras[1].content);
				result.content = paras[1].content;
				result.name = paras[0].content;
			}
			return result;
		}
	},
	"if" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			var condition = ProcessParas(paras.slice(0, 1), curScope)[0];
			if (condition.content) {
				return ProcessParas(paras.slice(1, 2), curScope)[0];
			} else {
				return ProcessParas(paras.slice(2, 3), curScope)[0];
			}
		}
	},
	"cond" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {

		}
	},
	"cons" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {

		}
	},
	"car" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"cdr" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"show" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			// console.log("syntax show called");
			var paras = ProcessParas(raw_paras, curScope);
			console.log(paras[0].content);
		}
	},
	"+" : {
		//TO DO
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			// console.log(raw_paras);
			var paras = ProcessParas(raw_paras, curScope);
			var result = {};
			result.type = "number-integer";
			result.content = "0";
			for (var i = 0; i < paras.length; ++i) {
				if (result.type == "number-integer") {
					if (paras[i].type == "number-integer") {
						var tmp = crunch.parse(paras[i].content);
						result.content = crunch.stringify(crunch.add(crunch.parse(result.content), tmp));
					} else {
						result.type = "number-float";
						result.content = parseFloat(result.content);
						var tmp = parseFloat(paras[i].content);
						result.content += tmp;
					}
				} else {
					var tmp = parseFloat(paras[i].content);
					result.content += tmp;
				}
			}
			return result;
		}
	},
	"-" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {};
			result.type = "number-integer";
			result.content = "0";
			if (result.type == "number-integer") {
				if (paras[0].type == "number-integer") {
					result.content = paras[0].content;
				} else {
					result.type = "number-float";
					result.content = parseFloat(result.content);
					var tmp = parseFloat(paras[0].content);
					result.content = tmp;
				}
			} else {
				var tmp = parseFloat(paras[0].content);
				result.content = tmp;
			}
			for (var i = 1; i < paras.length; ++i) {
				if (result.type == "number-integer") {
					if (paras[i].type == "number-integer") {
						var tmp = crunch.parse(paras[i].content);
						result.content = crunch.stringify(crunch.sub(crunch.parse(result.content), tmp));
					} else {
						result.type = "number-float";
						result.content = parseFloat(result.content);
						var tmp = parseFloat(paras[i].content);
						result.content -= tmp;
					}
				} else {
					var tmp = parseFloat(paras[i].content);
					result.content -= tmp;
				}
			}
			return result;
		}
	},
	"*" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {};
			result.type = "number-integer";
			result.content = "1";
			for (var i = 0; i < paras.length; ++i) {
				if (result.type == "number-integer") {
					if (paras[i].type == "number-integer") {
						var tmp = crunch.parse(paras[i].content);
						result.content = crunch.stringify(crunch.mul(crunch.parse(result.content), tmp));
					} else {
						result.type = "number-float";
						result.content = parseFloat(result.content);
						var tmp = parseFloat(paras[i].content);
						result.content *= tmp;
					}
				} else {
					var tmp = parseFloat(paras[i].content);
					result.content *= tmp;
				}
			}
			return result;
		}
	},
	"/" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {};
			result.type = "number-integer";
			result.content = "0";
			if (result.type == "number-integer") {
				if (paras[0].type == "number-integer") {
					result.content = paras[0].content;
				} else {
					result.type = "number-float";
					result.content = parseFloat(result.content);
					var tmp = parseFloat(paras[0].content);
					result.content = tmp;
				}
			} else {
				var tmp = parseFloat(paras[0].content);
				result.content = tmp;
			}
			for (var i = 1; i < paras.length; ++i) {
				if (result.type == "number-integer") {
					if (paras[i].type == "number-integer") {
						var tmp = crunch.parse(paras[i].content);
						result.content = crunch.stringify(crunch.div(crunch.parse(result.content), tmp));
					} else {
						result.type = "number-float";
						result.content = parseFloat(result.content);
						var tmp = parseFloat(paras[i].content);
						result.content /= tmp;
					}
				} else {
					var tmp = parseFloat(paras[i].content);
					result.content /= tmp;
				}
			}
			return result;
		}
	},
	">" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var isFloat = false;
			if (paras[0].type == "number-float" || paras[1].type == "number-float") {
				isFloat = true;
			}
			if (isFloat) {
				var floatA = paras[0].content;
				if (paras[0].type == "number-integer") {
					floatA = parseFloat(floatA);
				}
				var floatB = paras[1].content;
				if (paras[1].type == "number-integer") {
					floatB = parseFloat(floatB);
				}
				return { type : "boolean", content : floatA > floatB};
			} else {
				var intA = crunch.parse(paras[0].content);
				var intB = crunch.parse(paras[1].content);
				return { type : "boolean", content : crunch.compare(intA, intB) == 1 };
			}
		}
	},
	"<" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var isFloat = false;
			if (paras[0].type == "number-float" || paras[1].type == "number-float") {
				isFloat = true;
			}
			if (isFloat) {
				var floatA = paras[0].content;
				if (paras[0].type == "number-integer") {
					floatA = parseFloat(floatA);
				}
				var floatB = paras[1].content;
				if (paras[1].type == "number-integer") {
					floatB = parseFloat(floatB);
				}
				return { type : "boolean", content : floatA < floatB};
			} else {
				var intA = crunch.parse(paras[0].content);
				var intB = crunch.parse(paras[1].content);
				return { type : "boolean", content : crunch.compare(intA, intB) == -1 };
			}
		}
	},
	"=" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var isFloat = false;
			if (paras[0].type == "number-float" || paras[1].type == "number-float") {
				isFloat = true;
			}
			if (isFloat) {
				var floatA = paras[0].content;
				if (paras[0].type == "number-integer") {
					floatA = parseFloat(floatA);
				}
				var floatB = paras[1].content;
				if (paras[1].type == "number-integer") {
					floatB = parseFloat(floatB);
				}
				return { type : "boolean", content : floatA == floatB};
			} else {
				var intA = crunch.parse(paras[0].content);
				var intB = crunch.parse(paras[1].content);
				return { type : "boolean", content : crunch.compare(intA, intB) == 0 };
			}
		}
	},
	//should support more than two expression
	"and" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var result = true;
			for (var i = 0; i < raw_paras.length; ++i) {
				var para = ProcessParas(raw_paras.slice(i, i + 1), curScope)[0];
				if (!para.content) {
					result = false;
					break;
				}
			}
			return { type : "boolean", content : result};
		}
	},
	"or" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var result = false;
			for (var i = 0; i < raw_paras.length; ++i) {
				var para = ProcessParas(raw_paras.slice(i, i + 1), curScope)[0];
				if (para.content) {
					result = true;
					break;
				}
			}
			return { type : "boolean", content : result };
		}
	},
	"not" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var para = ProcessParas(raw_paras.slice(0, 1), curScope)[0];
			if (para.content) {
				return { type : "boolean", content : false };
			} else {
				return { type : "boolean", content : true };
			}
		}
	},
	"eq?" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"equal?" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	}
};

var globalScope = identifiers;

var fs = require("fs");

var data = fs.readFileSync("./src.scm", {encoding: 'utf8'});

var sents = util.GetSentences(data);

for (var i = 0; i < sents.length; ++i) {
	var processResult = ProcExec(sents[i], globalScope);
	if (typeof processResult === "undefined") {
		continue;
	} else if (processResult.type == "define-result") {
		if (processResult.content_type == "function") {
			processResult.type = "function";
			globalScope[processResult.name] = processResult;
			delete globalScope[processResult.name].name;
		} else {
			var uuid = util.genUUID();
			memPool[uuid] = processResult;
			globalScope[processResult.name] = {
				"uuid" : uuid,
				"type" : "identifier"
			};
			delete memPool[uuid].name;
		}
	}
}
