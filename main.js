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
	var paras = util.GetElements(str.slice(1, str.length - 1));
	if (paras[0].type == "procedure") {
		var firstProcessResult = ProcExec(paras[0].content, curScope);
		if (firstProcessResult.type = "function") {
			var thisFunction = firstProcessResult;
			var scope;
			if (typeof thisFunction.scope == "undefined") {
				scope = util.clone(curScope);
			} else {
				scope = util.clone(thisFunction.scope);
			}
			var funcParas = ProcessParas(paras.slice(1, paras.length), curScope);
			for (var i = 0; i < thisFunction.paraList.length; ++i) {
				curScope["define"]["exec"]([thisFunction.paraList[i], funcParas[i]], curScope, scope);
			}
			for (var attr in curScope) {
				if (typeof scope[attr] == "undefined") {
					scope[attr] = curScope[attr];
				}
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
				curScope["define"]["exec"]([thisFunction.paraList[i], funcParas[i]], curScope, scope);
				// console.log(scope[thisFunction.paraList[i].content]);
			}
			for (var attr in curScope) {
				if (typeof scope[attr] == "undefined") {
					scope[attr] = curScope[attr];
				}
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
			if (typeof scope[attr] == "undefined") {
				scope[attr] = curScope[attr];
			}
		}
		var funcParas = ProcessParas(paras, curScope);
		for (var i = 0; i < func.paraList.length; ++i) {
			curScope["define"]["exec"]([func.paraList[i], funcParas[i]], curScope, scope);
		}
		for (var i = 0; i < func.body.length - 1; ++i) {
			ProcExec(func.body[i].content, scope);
		}
		if (func.body[func.body.length - 1].type == "procedure") {
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
			// console.log(raw_paras[i].content);
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
				targetScope[resultName].scope = targetScope;
			} else {
				var resultName = paras[0].content;
				if (paras[1].type == "identifier" || paras[1].type == "syntax" || paras[1].type == "function") {
					if (paras[1].type == "identifier") {
						result = curScope[paras[1].content];
						targetScope[resultName] = result;
					} else {
						targetScope[resultName] = paras[1];
						targetScope[resultName].scope = targetScope;
					}
				} else {
					var realValue = ProcessParas(paras.slice(1, 2), curScope)[0];
					if (realValue.type == "function" || realValue.type == "syntax") {
						result = realValue;
						targetScope[resultName] = result;
						targetScope[resultName].scope = targetScope;
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
			//TO DO
		}
	},
	"apply" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {

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
					return ProcessParas(pp.slice(1, 2), curScope)[0];
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
			} else {
				result.type = "text-value";
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
				return { type : "boolean", content : true };
			} else {
				return { type : "boolean", content : false };
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
	"car" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras,curScope);
			return paras[0].content[0];
		}
	},
	"cdr" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			var paras = ProcessParas(raw_paras, curScope);
			return { "type" : "list", "content" : paras[0].content.slice(1, paras[0].content.length)};
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
			} else {
				process.stdout.write(paras[0].content.toString());
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
			console.log(paras);
			console.log(paras[0]);
			console.log(paras[1]);
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
	"eqv?" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"equal?" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
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
	}
};

var globalScope = identifiers;

var fs = require("fs");

var data = fs.readFileSync("./src.scm", {encoding: 'utf8'});

var sents = util.GetSentences(data);

for (var i = 0; i < sents.length; ++i) {
	ProcExec(sents[i], globalScope);
}
