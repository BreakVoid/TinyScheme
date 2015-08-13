var crunch = require("number-crunch");
var util = require("./util.js");

var memPool = {};
var identifier = {};
var TRUE_ID = util.genUUID();
var FALSE_ID = util.genUUID();

BOOL_TRUE = { "type" : "boolean", "content" : true };
BOOL_FALSE = { "type" : "boolean", "content" : false };
memPool[TRUE_ID] = BOOL_TRUE;
memPool[FALSE_ID] = BOOL_FALSE;

ProcessParas = function(raw_paras, curScope) {}

function ProcExec(str, curScope) {
	if (str[0] != '(' || str[str.length - 1] != ')') {
		if (curScope[str].type == "identifier") {
			return memPool[curScope[str].uuid];
		} else {
			return curScope[str];
		}
	}
	var paras = util.GetElements(str.slice(1, str.length - 1));
	if (paras[0].type == "procedure") {
		var firstProcessResult = ProcExec(paras[0].content, curScope);
		if (firstProcessResult.type = "function") {
			var thisFunction = firstProcessResult;
			var scope = util.clone(thisFunction.scope);
			var funcParas = ProcessParas(paras.slice(1, paras.length), curScope);
			for (var i = 0; i < thisFunction.paraList.length; ++i) {
				// console.log(thisFunction.paraList[i]);
				// console.log(funcParas[i]);
				if (thisFunction.paraList[i].content != ".") {
					curScope["define"]["exec"]([thisFunction.paraList[i], funcParas[i]], curScope, scope);
				} else {
					var plist = {
						"type" : "list",
						"content" : []
					};
					for (var j = i; j < funcParas.length; ++j) {
						plist.content.push(funcParas[j]);
					}
					curScope["define"]["exec"]([thisFunction.paraList[i + 1], plist], curScope, scope);
					break;
				}
				// console.log(scope[thisFunction.paraList[i].content]);
			}
			for (var i = 0; i < thisFunction.body.length - 1; ++i) {
				ProcExec(thisFunction.body[i].content, scope);
			}
			if (thisFunction.body[thisFunction.body.length - 1].type == "procedure") {
				return ProcExec(thisFunction.body[thisFunction.body.length - 1].content, scope);
			} else {
				if (thisFunction.body[thisFunction.body.length - 1].type == "identifier") {
					if (scope[thisFunction.body[thisFunction.body.length - 1].content].type == "identifier") {
						return memPool[scope[thisFunction.body[thisFunction.body.length - 1].content].uuid];
					} else {
						return scope[thisFunction.body[thisFunction.body.length - 1].content];
					}
				} else {
					return thisFunction.body[thisFunction.body.length - 1];
				}
			}
		}
	} else {
		var procedureName = paras[0].content;
		if (curScope[procedureName].type == "syntax") {
			if (procedureName == "define") {
				return curScope[procedureName]["exec"](paras.slice(1, paras.length), curScope, curScope);
			} else {
				return curScope[procedureName]["exec"](paras.slice(1, paras.length), curScope);
			}
		} else if (curScope[procedureName].type == "function") {
			// ("Named function called");
			// console.log(procedureName);
			var thisFunction = curScope[procedureName];
			var scope = util.clone(thisFunction.scope);
			var funcParas = ProcessParas(paras.slice(1, paras.length), curScope);
			// console.log(funcParas);
			for (var i = 0; i < thisFunction.paraList.length; ++i) {
				// console.log(thisFunction.paraList[i]);
				// console.log(funcParas[i]);
				if (thisFunction.paraList[i].content != ".") {
					curScope["define"]["exec"]([thisFunction.paraList[i], funcParas[i]], curScope, scope);
				} else {
					var plist = {
						"type" : "list",
						"content" : []
					};
					for (var j = i; j < funcParas.length; ++j) {
						plist.content.push(funcParas[j]);
					}
					curScope["define"]["exec"]([thisFunction.paraList[i + 1], plist], curScope, scope);
					break;
				}
				// console.log(scope[thisFunction.paraList[i].content]);
			}
			for (var attr in curScope) {
				if (typeof scope[attr] === "undefined") {
					scope[attr] = curScope[attr];
				}
			}
			for (var i = 0; i < thisFunction.body.length - 1; ++i) {
				ProcExec(thisFunction.body[i].content, scope);
			}
			if (thisFunction.body[thisFunction.body.length - 1].type == "procedure") {
				// console.log(thisFunction.body[thisFunction.body.length - 1].content);
				// if (thisFunction.body[thisFunction.body.length - 1].content == "(= (car configuration) col)") {
				// 	console.log(memPool[scope["configuration"].uuid].content);
				// 	console.log(memPool[scope["col"].uuid].content);
				// }
				return ProcExec(thisFunction.body[thisFunction.body.length - 1].content, scope);
			} else {
				if (thisFunction.body[thisFunction.body.length - 1].type == "identifier") {
					if (scope[thisFunction.body[thisFunction.body.length - 1].content].type == "identifier") {
						return memPool[scope[thisFunction.body[thisFunction.body.length - 1].content].uuid];
					} else {
						return scope[thisFunction.body[thisFunction.body.length - 1].content];
					}
				} else {
					return thisFunction.body[thisFunction.body.length - 1];
				}
			}

		}
	}
}

CallFunction = function(func, paras, curScope) {
	if (func.type == "syntax") {
		return func.exec(paras, curScope);
	} else {
		var scope;
		if (typeof func.scope == "undefined") {
			scope = util.clone(curScope);
		} else {
			scope = util.clone(func.scope);
		}
		for (var attr in curScope) {
			if (typeof scope[attr] === "undefined") {
				scope[attr] = curScope[attr];
			}
		}
		var funcParas = ProcessParas(paras, curScope);
		for (var i = 0; i < func.paraList.length; ++i) {
			// console.log(func.paraList[i]);
			// console.log(funcParas[i]);
			if (func.paraList[i].content != ".") {
				curScope["define"]["exec"]([func.paraList[i], funcParas[i]], curScope, scope);
			} else {
				var plist = {
					"type" : "list",
					"content" : []
				};
				for (var j = i; j < funcParas.length; ++j) {
					plist.content.push(funcParas[j]);
				}
				curScope["define"]["exec"]([func.paraList[i + 1], plist], curScope, scope);
				break;
			}
			// console.log(scope[thisFunction.paraList[i].content]);
		}
		for (var i = 0; i < func.body.length - 1; ++i) {
			// console.log(func.body[i].content);
			ProcExec(func.body[i].content, scope);
		}
		if (func.body[func.body.length - 1].type == "procedure") {
			// console.log(func.body[func.body.length - 1].content);
			// var tmp = ProcExec(func.body[func.body.length - 1].content, scope);
			// console.log(tmp);
			return ProcExec(func.body[func.body.length - 1].content, scope);
		} else {
			if (func.body[func.body.length - 1].type == "identifier") {
				if (scope[func.body[func.body.length - 1].content].type == "identifier") {
					return memPool[scope[func.body[func.body.length - 1].content].uuid];
				} else {
					return scope[func.body[func.body.length - 1].content];
				}
			} else {
				return func.body[func.body.length - 1];
			}
		}
	}
}

ProcessParas = function(raw_paras, curScope) {
	var result = [];
	for (var i = 0; i < raw_paras.length; ++i) {
		if (raw_paras[i].type == "procedure") {
			result.push(ProcExec(raw_paras[i].content, curScope));
		} else if (raw_paras[i].type == "identifier") {
			// console.log(curScope);
			// console.log(curScope[raw_paras[i].content]);
			if (curScope[raw_paras[i].content].type == "identifier") {
				result.push(memPool[curScope[raw_paras[i].content]["uuid"]]);
			} else if (curScope[raw_paras[i].content].type == "function" || curScope[raw_paras[i].content].type == "syntax") {
				var tmp = curScope[raw_paras[i].content];
				tmp.content = raw_paras[i].content;
				result.push(tmp);
			}
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
	"else" : {
		"type" : "identifier",
		"uuid" : TRUE_ID
	},
	"lambda" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			var result = { "type" : "function" };
			var functionForm = util.GetElements(paras[0].content.slice(1, paras[0].content.length - 1));
			result.paraList = functionForm.slice(0, functionForm.length);
			result.body = paras.slice(1, paras.length);
			result.scope = curScope;
			return result;
		}
	},
	"define" : {
		"type" : "syntax",
		"exec" : function(paras, curScope, targetScope) {
			var result = {};
			if (paras[0].type == 'procedure') {
				result.type = "function";
				result.body = paras.slice(1, paras.length);
				var functionForm = util.GetElements(paras[0].content.slice(1, paras[0].content.length - 1));
				var resultName = functionForm[0].content;
				result.paraList = functionForm.slice(1, functionForm.length);
				targetScope[resultName] = result;
				if (typeof targetScope[resultName].scope == "undefined") {
					targetScope[resultName].scope = targetScope;
				}
			} else {
				var resultName = paras[0].content;
				if (paras[1].type == "identifier" || paras[1].type == "syntax" || paras[1].type == "function") {
					if (paras[1].type == "identifier") {
						result = curScope[paras[1].content];
						targetScope[resultName] = result;
					} else {
						targetScope[resultName] = paras[1];
						if (typeof targetScope[resultName].scope == "undefined") {
							targetScope[resultName].scope = targetScope;
						}
					}
				} else {
					var realValue = ProcessParas(paras.slice(1, 2), curScope)[0];
					if (realValue.type == "function" || realValue.type == "syntax") {
						result = realValue;
						targetScope[resultName] = result;
						if (typeof targetScope[resultName].scope == "undefined") {
							targetScope[resultName].scope = targetScope;
						}
						return ;
					}
					var uuid = util.genUUID();
					memPool[uuid] = realValue;
					result = {
						"type" : "identifier",
						"uuid" : uuid
					};
					targetScope[resultName] = result;
				}
			}
		}
	},
	"map" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var func;
			if (paras[0].type == "identifier") {
				func = curScope[paras[0].content];
			} else {
				func = paras[0];
			}
			// console.log(func);
			var result = {
				"type" : "list",
				"content" : []
			}
			for (var i = 0; i < paras[1].content.length; ++i) {
				var tmpParas = [];
				for (var j = 1; j < paras.length; ++j) {
					tmpParas.push(paras[j].content[i]);
				}
				result.content.push(CallFunction(func, tmpParas, curScope));
			}
			return result;
		}
	},
	"apply" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			// console.log("syntax apply called");
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type == "identifier") {
				func = curScope[paras[0].content];
			} else {
				func = paras[0];
			}
			return CallFunction(func,  paras[1].content, curScope);
		}
	},
	"let" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			if (raw_paras[0].type != "identifier") {
				// console.log(raw_paras);
				var letBody = raw_paras.slice(1, raw_paras.length);
				var localVarPairs = util.GetElements(raw_paras[0].content.slice(1, raw_paras[0].content.length - 1));
				// console.log(localVarPairs);
				var localVarNames = [];
				var localVarValues = [];
				for (var i = 0; i < localVarPairs.length; ++i) {
					var tmp = util.GetElements(localVarPairs[i].content.slice(1, localVarPairs[i].content.length - 1));
					localVarNames.push(tmp[0]);
					localVarValues.push(tmp[1]);

				}
				// console.log(localVarNames);
				// console.log(localVarValues);
				var convertResult = "((lambda (";
				convertResult += localVarNames[0].content;
				for (var i = 1; i < localVarNames.length; ++i) {
					convertResult += " " + localVarNames[i].content;
				}
				convertResult += ')';
				for (var i = 0; i < letBody.length; ++i) {
					convertResult += " " + letBody[i].content;
				}
				convertResult += ')';
				for (var i = 0; i < localVarValues.length; ++i) {
					convertResult += " " + localVarValues[i].content;
				}
				convertResult += ")";
				// console.log("let ===: " + convertResult);
				return ProcExec(convertResult, curScope);
			} else {

			}
		}
	},
	"let*" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			if (raw_paras[0].type != "identifier") {
				// console.log(raw_paras);
				var letBody = raw_paras.slice(1, raw_paras.length);
				var localVarPairs = util.GetElements(raw_paras[0].content.slice(1, raw_paras[0].content.length - 1));
				// console.log(localVarPairs);
				var END = "";
				var convertResult = "";
				for (var i = 0; i < localVarPairs.length; ++i) {
					convertResult += "(let (" + localVarPairs[i].content + ") ";
					END += ")";
				}
				for (var i = 0; i < letBody.length; ++i) {
					convertResult += " " + letBody[i].content;
				}
				convertResult += END;
				return ProcExec(convertResult, curScope);
			} else {

			}
		}
	},
	"letrec" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			if (raw_paras[0].type != "identifier") {
				// console.log(raw_paras);
				var letBody = raw_paras.slice(1, raw_paras.length);
				var localVarPairs = util.GetElements(raw_paras[0].content.slice(1, raw_paras[0].content.length - 1));
				var scope = util.clone(curScope);
				// console.log(localVarPairs);
				var localVarNames = [];
				var localVarValues = [];
				for (var i = 0; i < localVarPairs.length; ++i) {
					var tmp = util.GetElements(localVarPairs[i].content.slice(1, localVarPairs[i].content.length - 1));
					localVarNames.push(tmp[0]);
					localVarValues.push(tmp[1]);

				}
				// console.log(localVarNames);
				// console.log(localVarValues);
				for (var i = 0; i < localVarPairs.length; ++i) {
					ProcExec("(define " + localVarNames[i].content + ".1 " + localVarValues[i].content + ")", scope);
				}
				for (var i = 0; i < localVarPairs.length; ++i) {
					scope[localVarNames[i].content] = scope[localVarNames[i].content + ".1"];
				}
				for (var i = 0; i < letBody.length - 1; ++i) {
					ProcExec(letBody[i].content, scope);
				}
				if (letBody[letBody.length - 1].type == "procedure") {
					return ProcExec(letBody[letBody.length - 1].content, scope);
				} else {
					if (letBody[letBody.length - 1].type == "identifier") {
						if (scope[letBody[letBody.length - 1].content].type == "identifier") {
							return memPool[scope[letBody[letBody.length - 1].content].uuid];
						} else {
							return scope[letBody[letBody.length - 1].content];
						}
					} else {
						return letBody[letBody.length - 1];
					}
				}
			} else {

			}
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
			for (var i = 0; i < paras.length; ++i) {
				var pp = util.GetElements(paras[i].content.slice(1, paras[i].content.length - 1));
				var condition = ProcessParas(pp.slice(0, 1), curScope)[0].content;
				if (condition) {
					for (var i = 1; i < pp.length - 1; ++i) {
						ProcessParas(pp.slice(i, i + 1), curScope);
					}
					return ProcessParas(pp.slice(pp.length - 1, pp.length), curScope)[0];
				}
			}
		}
	},
	"quote" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var result = {};
			if (raw_paras[0].type == "procedure") {
				result.type = "list";
				result.content = util.GetElements(raw_paras[0].content.slice(1, raw_paras[0].content.length - 1));
				for (var i = 0; i < result.content.length; ++i) {
					if (result.content[i].type == "procedure") {
						result.content[i] = curScope["quote"]["exec"]([result.content[i]], curScope);
					} else {
						if (util.isInteger(result.content[i].content)) {
							result.content[i].type = "number-integer";
						} else if (util.isFloatNumber(result.content[i].content)) {
							result.content[i].type = "number-integer";
						} else if (result.content[i].content[0] == '#' && result.content[i].length >= 2 && result.content[i].content[1] == '\\') {
							result.content[i].type = "char";
						} else if (result.content[i].content[0] == '#' && result.content[i].length >= 2 && result.content[i].content[1] == 't') {
							result.content[i].type = "boolean";
							result.content[i].content = true;
						} else if (result.content[i].content[0] == '#' && result.content[i].length >= 2 && result.content[i].content[1] == 'f') {
							result.content[i].type = "boolean";
							result.content[i].content = false;
						} else if (result.content[i].type == "identifier") {
							result.content[i].type = "symbol";
						}
					}
				}
			} else {
				result.type = "symbol";
				result.content = raw_paras[0].content;
			}
			return result;
		}
	},
	"null?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].content.length == 0) {
				return BOOL_TRUE;
			} else {
				return BOOL_FALSE;
			}
		}
	},
	"pair?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type == "pair") {
				return BOOL_TRUE;
			} else if (paras[0].type == "list" && paras[0].content.length == 2) {
				return BOOL_TRUE;
			} else {
				return BOOL_FALSE;
			}
		}
	},
	"list?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type == "list") {
				return BOOL_TRUE;
			} else {
				return BOOL_FALSE;
			}
		}
	},
	"cons" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			// console.log(paras);
			// console.log(paras[1].content);
			if (paras[1].type == "list") {
				var result = {};
				result.content = [];
				result.type = "list";
				result.content.push(paras[0]);
				for (var i = 0; i < paras[1].content.length; ++i) {
					result.content.push(paras[1].content[i]);
				}
				// console.log(result);
				return result;
			} else {
				var result = {};
				result.content = [];
				result.type = "pair";
				result.content.push(paras[0]);
				result.content.push(paras[1]);
				return result;
			}
		}
	},
	"list" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {
				"type" : "list",
				"content" : paras
			};
			return result;
		}
	},
	"append" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {
				"type" : "list",
				"content" : []
			};
			for (var i = 0; i < paras.length; ++i) {
				for (var j = 0; j < paras[i].content.length; ++j) {
					result.content.push(paras[i].content[j]);
				}
			}
			return result;
		}
	},
	"length" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {
				"type" : "number-integer",
				"content" : paras[0].content.length.toString()
			};
			return result;
		}
	},
	"list-ref" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return paras[0].content[parseInt(paras[1].content)];
		}
	},
	"car" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras,curScope);
			return paras[0].content[0];
		}
	},
	"caar" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras,curScope);
			return paras[0].content[0].content[0];
		}
	},
	"cdr" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type == "list") {
				return { "type" : "list", "content" : paras[0].content.slice(1, paras[0].content.length)};
			} else {
				return paras[0].content[1];
			}
		}
	},
	"cadr" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return paras[0].content[1];
		}
	},
	"cadar" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return paras[0].content[0].content[1];
		}
	},
	"reverse" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var para = ProcessParas(raw_paras, curScope)[0];
			if (para.type == "list") {
				var result = {
					"type" : "list",
					"content" : []
				};
				for (var i = para.content.length - 1; i >= 0; --i) {
					result.content.push(para.content[i]);
				}
				return result;
			} else if (para.type == "pair") {
				return {
					"type" : "pair",
					"content" : [para.content[1], para.content[0]]
				};
			}
		}
	},
	"display" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type == "list") {
				process.stdout.write(util.DisplayRecursively(paras[0]));
			} else if (paras[0].type == "pair") {
				process.stdout.write("(");
				curScope["display"]["exec"]([paras[0].content[0]], curScope);
				process.stdout.write(" . ");
				curScope["display"]["exec"]([paras[0].content[1]], curScope);
				process.stdout.write(")");
			} else if (paras[0].type == "boolean") {
				if (paras[0].content) {
					process.stdout.write("#t");
				} else {
					process.stdout.write("#f");
				}
			} else {
				if (typeof paras[0].content.toString != "undefined") {
					process.stdout.write(paras[0].content.toString());
				} else {
					process.stdout.write(paras[0].content);
				}

			}
		}
	},
	"newline" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			process.stdout.write("\n");
		}
	},
	"+" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
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
			result.type = "number-float";
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
	"quotient" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return {
				content : crunch.stringify(crunch.div(crunch.parse(paras[0].content), crunch.parse(paras[1].content))),
				type : "number-integer"
			};
		}
	},
	"modulo" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return {
				content : crunch.stringify(crunch.mod(crunch.parse(paras[0].content), crunch.parse(paras[1].content))),
				type : "number-integer"
			};
		}
	},
	"sqr" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return curScope["*"]["exec"]([paras[0], paras[0]], curScope);
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
	"<=" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (curScope["<"]["exec"](paras, curScope).content) {
				return BOOL_TRUE;
			} else if (curScope["="]["exec"](paras, curScope).content) {
				return BOOL_TRUE;
			} else {
				return BOOL_FALSE;
			}
		}
	},
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
		"exec" : function(raw_paras, curScope) {
			// var paras = ProcessParas(raw_paras, curScope);
			return curScope["eqv?"]["exec"](raw_paras, curScope);
		}
	},
	"eqv?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type != paras[1].type) {
				return BOOL_FALSE;
			}
			if (paras[0].type == "boolean" && paras[1].type == "boolean") {
				if (paras[0].content == paras[1].content) {
					return BOOL_TRUE;
				} else {
					return BOOL_FALSE;
				}
			}
			if (paras[0].type == "number-integer") {
				return curScope["="]["exec"](paras, curScope);
			} else if (paras[0].type == "number-float") {
				return curScope["="]["exec"](paras, curScope);
			} else if (paras[0].type == "symbol") {
				var str1 = curScope["symbol->string"]["exec"]([paras[0]], curScope);
				var str2 = curScope["symbol->string"]["exec"]([paras[1]], curScope);
				return curScope["string=?"]["exec"]([str1, str2], curScope);
			} else if (paras[0].type == "list") {
				if (paras[0].content.length == 0 && paras[1].content.length == 0) {
					return BOOL_TRUE;
				} else {
					return BOOL_FALSE;
				}
			} else if (paras[0].type == "char") {
				if (paras[0].content == paras[1].content) {
					return BOOL_TRUE;
				} else {
					return BOOL_FALSE;
				}
			} else {
				if (paras[0] == paras[1]) {
					return BOOL_TRUE;
				} else {
					return BOOL_FALSE;
				}
			}
		}
	},
	"equal?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type != paras[1].type) {
				return BOOL_FALSE;
			} else {
				if (paras[0].type == "list" || paras[0] == "pair") {
					if (paras[0].content.length != paras[1].content.length) {
						return BOOL_FALSE;
					}
					for (var i = 0; i < paras[0].content.length; ++i) {
						if (!curScope["equal?"]["exec"]([paras[0].content[i], paras[1].content[i]], curScope)) {
							return BOOL_FALSE;
						}
					}
					return BOOL_TRUE;
				} else {
					if (paras[0].type != paras[1].type) {
						return BOOL_FALSE;
					}
					if (paras[0].type == "boolean" && paras[1].type == "boolean") {
						if (paras[0].content == paras[1].content) {
							return BOOL_TRUE;
						} else {
							return BOOL_FALSE;
						}
					}
					if (paras[0].type == "number-integer") {
						return curScope["="]["exec"](paras, curScope);
					} else if (paras[0].type == "number-float") {
						return curScope["="]["exec"](paras, curScope);
					} else if (paras[0].type == "symbol") {
						var str1 = curScope["symbol->string"]["exec"]([paras[0]], curScope);
						var str2 = curScope["symbol->string"]["exec"]([paras[1]], curScope);
						return curScope["string=?"]["exec"]([str1, str2], curScope);
					} else if (paras[0].type == "list") {
						if (paras[0].content.length == 0 && paras[1].content.length == 0) {
							return BOOL_TRUE;
						} else {
							return BOOL_FALSE;
						}
					} else if (paras[0].type == "string") {
						if (paras[0].content == paras[1].content) {
							return BOOL_TRUE;
						} else {
							return BOOL_FALSE;
						}
					} else if (paras[0].type == "char") {
						if (paras[0].content == paras[1].content) {
							return BOOL_TRUE;
						} else {
							return BOOL_FALSE;
						}
					} else {
						if (paras[0] == paras[1]) {
							return BOOL_TRUE;
						} else {
							return BOOL_FALSE;
						}
					}
				}
			}
		}
	},
	"zero?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].type == "number-integer" || paras[0].type == "number-float") {
				if (paras[0].type == "number-integer") {
					return { type : "boolean", content : paras[0].content == "0" || paras[0].content == "-0" };
				} else {
					return { type : "boolean", content : paras[0].content == 0.0 };
				}
			} else {
				return { type : "boolean", content : false };
			}
		}
	},
	"string=?" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			if (paras[0].content.length != paras[1].content.length) {
				return BOOL_FALSE;
			} else {
				for (var i = 0; i < paras[0].content.length; ++i) {
					if (paras[0].content[i] !=paras[1].content[i]) {
						return BOOL_FALSE;
					}
				}
				return BOOL_TRUE;
			}
		}
	},
	"symbol->string" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			var result = {
				"type" : "string",
				"content" : paras[0].content.toLowerCase()
			};
			return result;
		}
	},
	"begin" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			for (var i = 0; i < raw_paras.length; ++i) {
				ProcExec(raw_paras[i].content, curScope);
			}
		}
	},
	"memq" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			for (var i = 0; i < paras[1].content.length; ++i) {
				if (curScope["equal?"]["exec"]([paras[0], paras[1].content[i]], curScope).content) {
					return {
						"type" : "list",
						"content" : paras[1].content.slice(i, paras[1].content.length)
					};
				}
			}
			return BOOL_FALSE;
		}
	}
};

var globalScope = identifiers;

var fs = require("fs");

var data = fs.readFileSync("./src.scm", {encoding: 'utf8'});

var sents = util.GetSentences(data);

for (var i = 0; i < sents.length; ++i) {
	ProcExec(sents[i], globalScope);
}
