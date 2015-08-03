PPCA2015 Scheme Interpreter Powered By BreakVoid(Song-Yu Ke)
================================================

A tiny Scheme interpreter written by javascript

#Environment:
Node.Js v0.12
Run "node ./main.js" and put your source in "./src.scm".

The interpreter will read the code from "./src.scm" and execute them.

-Use a package to support big integers

-Tail call optimization is not supported.

-the syntax `let' is interpretered by an equivalent way.

    (let ((variable init) ...) expression expression ...)
    -----------------------
    ((lambda (variable ...) expression expression ...) init ...)

-the syntax `let*' is interpretered by an equivalent way.

    (let* ((variable1 init1)
       (variable2 init2)
       ...
       (variableN initN))
       expression
       expression ...)
    -----------------------
    (let ((variable1 init1))
    	(let ((variable2 init2))
    		...
    			(let ((variableN initN))
    			expression
    			expression ...)
    		...))

-the syntax `lerec' is interpretered by an equivalent way like:

    (letrec ((even?
            (lambda (n)
              (if (zero? n)
                  #t
                  (odd? (- n 1)))))
           (odd?
            (lambda (n)
              (if (zero? n)
                  #f
                  (even? (- n 1))))))
    (even? 88))
    -----------------------
    ((lambda ()
    	(define even?.1
    		(lambda (n)
              (if (zero? n)
                  #t
                  (odd? (- n 1)))))
        (define odd?.1
        	(lambda (n)
              (if (zero? n)
                  #f
                  (even? (- n 1)))))
        (define even? even?.1)
        (define odd? odd?.1)
        (even? 88)))
