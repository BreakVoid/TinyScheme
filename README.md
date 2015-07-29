PPCA2015 Scheme Interpreter Powered By BreakVoid(Song-Yu Ke)
================================================

A tiny Scheme interpreter written by javascript

-Use a package to support big integers

-Tail call optimization is not supported.

-the syntax `let' is interpretered by an equivalent way.

    (let ((variable init) ...) expression expression ...)
    ((lambda (variable ...) expression expression ...) init ...)

-the syntax `let*' is interpretered by an equivalent way.

    (let* ((variable1 init1)
       (variable2 init2)
       ...
       (variableN initN))
       expression
       expression ...)

    (let ((variable1 init1))
    	(let ((variable2 init2))
    		...
    			(let ((variableN initN))
    			expression
    			expression ...)
    		...))