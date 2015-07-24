(define (show obj)
  (display obj)
  (newline))

(define (title obj)
  (newline)
  (show obj))

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
(show "-----------------------------")
(show (if (and (> 3 2) #t #t (< 4 10)) (* 12123 123) (= 4 4)))
(show (if (and (> 3 2) #t #f (< 4 10)) (* 12123 123) (= 4 4)))
(show (if (or (< 3 2) #t #f (< 4 10)) (* 12123 2321) (= 4 4)))

(define foo (if (> 78 12) (+ (+ 2 3) 3) (- (* 3 4 3) 1 2)))
(show foo)

(define rrr (cond ((= foo 9) 512) (else (/ 1287218 1213.2))))
(show rrr)

(define (square x) (* x x))

(show (square (square 512)))

(define (compare opt a b)
	(opt a b))

(show (if (compare > 3 2) (- 3 2) (- 2 3)))
(show (if (compare < 3 2) (- 3 2) (- 2 3)))


(define aaa 4)
(define (id) aaa)
(define (fun1 x) (id))
(show (fun1 5))
(fun1 11)
(show (fun1 23))

(define (double-opt fun x) (fun (fun x)))
(show (double-opt square 16))

(show (square (double-opt square (double-opt square 16))))

(define (sqr x) (* x x))
(define (my-odd? n) (= (modulo n 2) 1))

(show "---------------------------------------------------------")

(define (fast-exp a n)
  (if (= n 0)
      1
      (if (my-odd? n)
          (* a (sqr (fast-exp a (quotient n 2))))
          (sqr (fast-exp a (quotient n 2))))))

(show (fast-exp 2 0))
(show (fast-exp 2 5))
(show (fast-exp 2 100))

(define _4 12345678901234567890)
(define _5 98765432109876543210)
(show (* (- _4 _5) (+ _4 200 _5)))

(show '(1 2 3 4 5))
(show ''(1 2 3 4 5))
(show '''(1 2 23 4 2 2))

(show (null? '()))
(show (null? '(1)))

(show "Test without side effect")


(title "basic operations")
(define _1 1)
(define _2 2)
(define (_3) 3)
(show (+ _1 _2 (_3)))
(show (- _2 (_3)))
(show (* _2 (_3)))
(show (/ _2 (_3)))
(show (quotient _2 (_3)))
(show (modulo _2 (_3)))
(show (if (= _1 1)
             (_3)
             _2))

(title "compute e")
(define (computeE e k f m)
  (if (> k m)
      e
      (computeE (+ e (/ 1.0 f)) (+ k 1) (* f k) m)))

(show (computeE 0 1 1.0 100))