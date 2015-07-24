function clone(objectToBeCloned) {
 	// Basis.
  	if (!(objectToBeCloned instanceof Object)) {
   		return objectToBeCloned;
  	}

  	var objectClone;

  	// Filter out special objects.
  	var Constructor = objectToBeCloned.constructor;
  	switch (Constructor) {
	    // Implement other special objects here.
    	case RegExp:
      		objectClone = new Constructor(objectToBeCloned);
      		break;
    	case Date:
      		objectClone = new Constructor(objectToBeCloned.getTime());
      		break;
    	default:
      		objectClone = new Constructor();
  	}

  	// Clone each property.
  	for (var prop in objectToBeCloned) {
	    objectClone[prop] = objectToBeCloned[prop];
  	}
  	return objectClone;
}

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
		// console.log(curScope[procedureName]);
		return curScope[procedureName]["exec"](paras.slice(1, paras.length), curScope);
	} else if (curScope[procedureName].type == "function") {
		// console.log("Custom function called");
		// console.log(str);

		var thisFunction = curScope[procedureName];
		var scope = clone(thisFunction.scope);
		var funcParas = ProcessParas(paras.slice(1, paras.length), curScope);
		// console.log(funcParas);
		for (var i = 0; i < thisFunction.paraList.length; ++i) {
			// console.log(thisFunction.paraList[i].content + "=" + funcParas[i].content);
			var processResult = curScope["define"]["exec"]([thisFunction.paraList[i], funcParas[i]], curScope);
			// console.log(processResult);
			if (processResult.content_type != "function" && processResult.content_type != "syntax") {
				var uuid = util.genUUID();
				memPool[uuid] = processResult;
				memPool[uuid].type = processResult.content_type;
				scope[processResult.name] = {
					"uuid" : uuid,
					"type" : "identifier"
				};
			} else {
				scope[processResult.name] = processResult;
				scope[processResult.name].type = processResult.content_type;
			}
			// delete memPool[uuid].name;
		}

		for (var i = 0; i < thisFunction.body.length - 1; ++i) {
			var processResult = ProcExec(thisFunction.body[i].content, scope);
			if (typeof processResult === "undefined") {
				continue;
			} else if (processResult.type == "define-result") {
				if (processResult.content_type == "function" || processResult.content_type == "syntax") {
					processResult.type = processResult.content_type;
					scope[processResult.name] = processResult;
					if (processResult.type == "function") {
						scope[processResult.name].scope = scope;
					}
					// delete scope[processResult.name].name;
					// delete scope[processResult.name].content_type;
					// console.log(processResult);
				} else {
					var uuid = util.genUUID();
					memPool[uuid] = processResult;
					memPool[uuid].type = processResult.content_type;
					scope[processResult.name] = {
						"uuid" : uuid,
						"type" : "identifier"
					};
					// delete memPool[uuid].name;
					// delete memPool[uuid].content_type;
				}
			}
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

ProcessParas = function(raw_paras, curScope) {
	// console.log("function ProcessParas called");
	// console.log(raw_paras);
	// console.log(raw_paras);
	var result = [];
	for (var i = 0; i < raw_paras.length; ++i) {
		if (raw_paras[i].type == "procedure") {
			result.push(ProcExec(raw_paras[i].content, curScope));
		} else if (raw_paras[i].type == "identifier") {
			// console.log("**")
			// console.log(curScope[raw_paras[i].content]);
			// console.log(raw_paras[i]);
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
	// console.log(result);
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
			var result = { type : "define-result" };
		}
	},
	"define" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			// console.log(paras);
			// console.log("define syntax called");
			// console.log(paras);
			var result = { type : "define-result" };
			if (paras[0].type == 'procedure') {
				result.content_type = "function";
				result.body = paras.slice(1, paras.length);
				var functionForm = util.GetElements(paras[0].content.slice(1, paras[0].content.length - 1));
				// console.log(functionForm);
				result.name = functionForm[0].content;
				result.paraList = functionForm.slice(1, functionForm.length);
			} else {
				if (paras[1].type == "identifier" || paras[1].type == "syntax" || paras[1].type == "function") {
					result = curScope[paras[1].content];
					result.content_type = curScope[paras[1].content].type;
					result.type = "define-result";
				} else {
					var realValue = ProcessParas(paras.slice(1, 2), curScope)[0];
					result = realValue;
					result.content_type = realValue.type;
					result.type = "define-result";
				}
				result.name = paras[0].content;
			}
			return result;
		}
	},
	"if" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			// console.log(paras);
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
	"display" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			// console.log("syntax show called");
			// console.log(raw_paras);
			var paras = ProcessParas(raw_paras, curScope);
			// console.log(paras);
			if (paras[0].type == "list") {
				var output = "(";
				if (paras[0].content.length > 0) {
					output += paras[0].content[0].content.toString();
				}
				for (var i = 1; i < paras[0].content.length; ++i) {
					output += " " + paras[0].content[i].content.toString();
				}
				output += ')';
				process.stdout.write(output);
			} else {
				process.stdout.write(paras[0].content.toString());
			}
		}
	},
	"newline" : {
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			console.log("");
		}
	},
	"+" : {
		//TO DO
		"type" : "syntax",
		"exec" : function(raw_paras, curScope) {
			// console.log(raw_paras);
			var paras = ProcessParas(raw_paras, curScope);
			// console.log(paras);
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
			// console.log(paras);
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
			// console.log(paras);
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
			// console.log("less than called");
			// console.log(raw_paras);
			var paras = ProcessParas(raw_paras, curScope);
			// console.log(paras);
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
	// console.log(globalScope);
	// console.log(processResult);
	if (typeof processResult === "undefined") {
		continue;
	} else if (processResult.type == "define-result") {
		if (processResult.content_type == "function" || processResult.content_type == "syntax") {
			processResult.type = processResult.content_type;
			globalScope[processResult.name] = processResult;
			if (processResult.content_type == "function") {
				globalScope[processResult.name].scope = globalScope;
			}
			// delete globalScope[processResult.name].name;
			// delete globalScope[processResult.name].content_type;
			// console.log(processResult);
		} else {
			var uuid = util.genUUID();
			memPool[uuid] = processResult;
			memPool[uuid].type = processResult.content_type;
			globalScope[processResult.name] = {
				"uuid" : uuid,
				"type" : "identifier"
			};
			// delete memPool[uuid].name;
			// delete memPool[uuid].content_type;
		}
	} else {
		// console.log(processResult);
	}
}
