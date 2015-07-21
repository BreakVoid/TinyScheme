var crunch = require("number-crunch");
var util = require("./util.js");

var memPool = {};
var identifier = {};

function ProcExec(str, curScope) {
	// return a object {"type" : ...., "content" : ....}
	var procParas = util.GetElements(str.slice(1, str.length - 1));
	if (curScope[procParas[0].content].type == "syntax" && procParas[0].content != "define") {
		var paraList = [];
		for (var i = 1; i < procParas.length; ++i) {
			if (procParas[i].type == "procedure") {
				paraList.push(ProcExec(procParas[i].content, curScope));
			} else if (procParas[i].type == "identifier") {
				paraList.push(memPool[curScope[procParas[i].content].uuid]);
			} else {
				paraList.push(procParas[i]);
			}
		}
		return curScope[procParas[0].content]["exec"](paraList, curScope);
	} else {
	}
}

identifiers = {
	"define" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			var result = {};
			if (paras[0].type == 'procedure') {
				result.type = "function";
				result.scope = curScope;
				result.body = paras.slice(1, paras.length);
				var functionForm = util.GetElements(paras[0]);
				result.name = functionForm[0].content;
				result.paraList = functionForm.slice(1, funtionForm.length);
			} else {
				result.type = util.GetType(paras[1].content);
				result.content = paras[1].content;
				result.name = paras[0].content;
			}
			return result;
		}
	},
	"if" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
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
		"exec" : function(paras, curScope) {
			console.log(paras[0].content);
		}
	},
	"+" : {
		//TO DO
		"type" : "syntax",
		"exec" : function(paras, curScope) {
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
		"exec" : function(paras, curScope) {
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
		"exec" : function(paras, curScope) {
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
		"exec" : function(paras, curScope) {
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
		"exec" : function(paras, curScope) {
		}
	},
	"<" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"=" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	//should support more than two expression
	"and" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"or" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"not" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
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
	var str = sents[i];
	var procParas = util.GetElements(str.slice(1, str.length - 1));
	if (procParas[0].content == "define") {
		if (procParas[1].type == "procedure") {
			var defRes = globalScope["define"]["exec"](procParas.slice(1, procParas.length), globalScope);
			globalScope[defRes.name] = defRes;
			delete globalScope[defRes.name].name;l
		} else {
			var value = "";
			if (procParas[2].type == "procedure") {
				value = ProcExec(procParas[2].content, globalScope);
				var defRes = globalScope["define"]["exec"]([procParas[1], value], globalScope);
				var uuid = util.genUUID();
				memPool[uuid] = defRes;
				globalScope[defRes.name] = {
					"uuid" : uuid,
					"type" : "identifier"
				};
				delete globalScope[defRes.name].name;
			} else {
				var defRes = globalScope["define"]["exec"](procParas.slice(1, procParas.length), globalScope);
				var uuid = util.genUUID();
				memPool[uuid] = defRes;
				globalScope[defRes.name] = {
					"uuid" : uuid,
					"type" : "identifier"
				};
				delete globalScope[defRes.name].name;
			}
		}
	} else {
		ProcExec(sents[i], globalScope);
	}
}
