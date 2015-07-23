(show (+ 2 4))
(show (+ 21344 23721 23127 234887421397431234987493128642373473647162347789347 34712384678796779354981327478973 -324823798561982347))
(define x 23123123)
(define y 2312343)
(show (+ x y))
(define 123123xx23 23847346782)
(define 238mq2h 21312499784)
(define 123871k x)
(show (+ x x x x y y y 123123xx23 123123xx23 -1236764 21896345))
(define result (+ x x x x y y y 123123xx23 123123xx23 -1236764 21896345))
(show result)
(define fx 0.21312)
(define fy 0.12312)
(show (+ fx fy))
(define fz (+ fx fx fy fy))
(show fz)
(show (+ (+ (+ 1 1)
	  (+ 1 2)
	  (+ 1 3))
   (+ 4 5)))

(show (* 2.5 2.5))
(show (* 213123 23123 12312312))
(show (* 213123 2.23216726372))

(show (- 12372312674 2836824 3762))
(show (- 4 5))
(show (- 0.4 0.5))

(show (+ (* (- 4 5)
	        -3
	        6)
         (- 287 187)))

(show (if #f 2 3))
(show (if #f (+ 4 6) (- 92 3412)))
(show (if (> 3 23) (+ 3 2) (- 2 3)))

(show (if (and (> 3 2) #t #t (< 4 10)) (* 12123 123) (= 4 4)))
(show (if (and (> 3 2) #t #f (< 4 10)) (* 12123 123) (= 4 4)))
(show (if (or (< 3 2) #t #f (< 4 10)) (* 12123 2321) (= 4 4)))

(define foo (if (> 78 12) (+ (+ 2 3) 3) (- (* 3 4 3) 1 2)))
(show foo)

(define rrr (cond ((= foo 9) 512) (else (/ 1287218 1213.2))))
(show rrr)

(define (square x) (* x x))

(show (square (square 512)))