var crunch = require("number-crunch");
var util = require("./util.js");

exports.memPool = {};

exports.identifiers = {
	"define" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
			var result = {};

			if (paras[0].type == 'procedure') {
				result.type = "procedure";
				result.scope = curScope;
				result.body = paras.slice(1, paras.length);
				var functionForm = util.GetElements(paras[0]);
				result.name = functionForm[0];
				result.paraList = functionForm.slice(1, funtionForm.length);
			} else {
				var value = "";
				if (paras[1].type = "procedure") {

				}
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
				var tmp = parseInt(paras[i].content);
				result.content = (parseInt(result.content) + tmp).toString();
			}
			return result;
		}
	},
	"-" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {

		}
	},
	"*" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
		}
	},
	"/" : {
		"type" : "syntax",
		"exec" : function(paras, curScope) {
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

