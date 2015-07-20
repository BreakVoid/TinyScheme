var syntax = require("./syntax.js");
var util = require("./util.js");

var globalScope = syntax.identifiers;

function ProcExec(str, curScope) {
	// return a object {"type" : ...., "content" : ....}
	var procParas = util.GetElements(str.slice(1, str.length - 1));
	if (curScope[procParas[0].content].type == "syntax" && procParas[0].content != "define") {
		var paraList = [];
		for (var i = 1; i < procParas.length; ++i) {
			if (procParas[i].type == "procedure") {
				paraList.push(ProcExec(procParas[i].content, curScope));
			} else if (procParas[i].type == "identifier") {
				paraList.push(syntax.memPool[curScope[procParas[i].content].uuid]);
			} else {
				paraList.push(procParas[i]);
			}
		}
		return curScope[procParas[0].content]["exec"](paraList, curScope);
	} else {
	}
}

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
				syntax.memPool[uuid] = defRes;
				globalScope[defRes.name] = {
					"uuid" : uuid,
					"type" : "identifier"
				};
				delete globalScope[defRes.name].name;
			} else {
				var defRes = globalScope["define"]["exec"](procParas.slice(1, procParas.length), globalScope);
				var uuid = util.genUUID();
				syntax.memPool[uuid] = defRes;
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
