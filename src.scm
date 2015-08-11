(define (show obj)
  (display obj)
  (newline))

(define (title obj)
  (newline)
  (show obj))

(define (filter pred? lst)
  (if (null? lst)
      '()
      (if (pred? (car lst))
          (cons (car lst) (filter pred? (cdr lst)))
          (filter pred? (cdr lst)))))

(define (flatmap func lst)
  (apply append (map func lst)))

(define (interval start end)
  (if (= start end)
      '()
      (cons start (interval (+ start 1) end))))

(define (any-of? pred? lst)
  (if (null? lst)
      #f
      (or (pred? (car lst)) (any-of? pred? (cdr lst)))))
(define (none-of? pred? lst)
  (not (any-of? pred? lst)))
(define (all-of? pred? lst)
  (if (null? lst)
      #t
      (and (pred? (car lst)) (all-of? pred? (cdr lst)))))

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
(define (fun1 aaa) (id))
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
(show (computeE 0 1 1.0 1000))

(define (factional n)
  (if (< n 2)
    1
    (* n (factional (- n 1)))))
(show (factional 10))

(show (fast-exp 2 0))
(show (fast-exp 2 5))
(show (fast-exp 2 100))
(show (fast-exp 2 0))
(show (fast-exp 2 5))
(show (fast-exp 2 1000))

(define quick-pow (lambda (a n)
  (if (= n 0)
    1
    (if (= (modulo n 2) 1)
      (* (quick-pow (* a a) (quotient n 2)) a)
      (quick-pow (* a a) (quotient n 2))))))

(show (quick-pow 2 0))
(show (quick-pow 2 5))

(define lst1 '(2 3 4))
(define lst2 (cons 1 lst1))
(show lst2)
(show (cons 0 (cons 1 lst1)))
(show (car lst1))
(show (car lst2))
(show (cdr lst1))
(show (cdr lst2))

(define (interval start end)
  (if (= start end)
      '()
      (cons start (interval (+ start 1) end))))

(show (interval 1 20))

(define (filter pred? lst)
  (if (null? lst)
      '()
      (if (pred? (car lst))
          (cons (car lst) (filter pred? (cdr lst)))
          (filter pred? (cdr lst)))))

(define lst1-to50 (interval 1 51))
(define (greater-than25 x)
  (> x 25))

(show (filter greater-than25 lst1-to50))
(show
  ((lambda (n) (+ n n)) 5))

(show
  (let ((x 2) (y 3))
  (* x y)))

(show
  (let ((x 2) (y 3))
  (let* ((x 7)
         (z (+ x y)))
    (* z x))))

(show
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
  (even? 88)))

(title "fibonacci sequence")
(define fib
  (lambda (n)
    (letrec ((calc-fib (lambda (prev now n)
                         (if (= n 0)
                             prev
                             (calc-fib now (+ prev now) (- n 1))))))
      (calc-fib 0 1 n))))

(show (fib 5))
(show (fib 20))
(show (fib 32))

(show (cons
  '(1 2 3 4 5) '(1 2 3 4 6)))
(show
  (cons
    (cons 1 2)
    (cons 2 3)))

(show
  (cons 'a '(b c)))

(show
  (list 'a (+ 3 4) 'c))
(show (list))

(show
  (append '(x) '(y)))

(show
  (append '(a (b)) '((c))))
(show
  (append '(a b) '(c . d)))

(title "Test Syntax Map")

(define 1to50 (interval 1 51))
(define ress
  (map
    (lambda (x)
      (if (> x 15)
        x
        -1))
    1to50))
(show ress)

(show
  (apply append
    (list '(1) '(2))))

(title "N-queens")
(define (NQU size)
  (define all-cols (interval 1 (+ size 1)))
  (define (valid? n configuration)
    (and (none-of? (lambda (col) (= (car configuration) col)) (cdr configuration))
         (none-of? (lambda (diag) (= (- n (car configuration)) diag))
                   (map - (interval (+ n 1) (+ size 1)) (cdr configuration)))
         (none-of? (lambda (cdiag) (= (+ n (car configuration)) cdiag))
                   (map + (interval (+ n 1) (+ size 1)) (cdr configuration)))))

  (define (choose-col n)
    (if (= n (+ size 1))
        (list '())
        (filter
         (lambda (configuration) (valid? n configuration))
         (flatmap
          (lambda (configuration)
            (map (lambda (sel) (cons sel configuration))
                 all-cols))
          (choose-col (+ n 1))))))
  (choose-col 1))

(show (length (NQU 5)))

(show
  (eqv? 'a 'a))
(show
  (not (eqv? 'a 'b)))

(show
  (let ((lst (cons 1 2)))
         (eqv? lst lst)))

(define (hanoi src dest mid n)
  (if (= n 0)
      '()
      (append (hanoi src mid dest (- n 1))
              (list (list src dest))
              (hanoi mid dest src (- n 1)))))


(title "hanoi")
(show (hanoi 'a 'b 'c 3))

(title "let-bindins")
(define var1 1)
(show (let ((var1 2)
               (y (lambda () var1)))
           (y)))
(show (let* ((var1 2)
                (y (lambda () var1)))
           (y)))
(show (letrec ((var1 2)
                  (y (lambda () var1)))
           (y)))
(show (let* ((var1 2)
             (y var1))
           y))

(title "infinite stream")
(define (make-stream start step)
  (cons start (lambda () (make-stream (+ start step) step))))
(define (head stream) (car stream))
(define (tail stream) ((cdr stream)))
(define (nth-from stream n)
  (if (= n 0)
      stream
      (nth-from (tail stream) (- n 1))))

(define stream (make-stream 0 1))
(show (head stream))
(show (head (nth-from stream 4)))
(define stream (nth-from stream 100))
(show (head stream))

(define (stream-map func . streams)
  (cons (apply func (map head streams))
        (lambda ()
          (apply stream-map (append (list func) (map tail streams))))))
(define sqrn-minus-n
  (stream-map - (stream-map sqr (make-stream 0 1)) (make-stream 0 1)))
(show (head (nth-from sqrn-minus-n 5)))
(show (head (nth-from sqrn-minus-n 100)))

(title "predicate eqv?")
(show (and
       (eqv? 'a 'a)
       (not (eqv? 'a 'b))
       (eqv? 'lowercase 'LOwERcaSE)
       (eqv? '() '())
       (eqv? 10000000000000 10000000000000)
       (not (eqv? (cons 1 2) (cons 1 2)))
       (let ((lst (cons 1 2)))
         (eqv? lst lst))
       (not (eqv? (lambda () 1) (lambda () 2)))
       (not (eqv? #f 'nil))
       (let ((p (lambda (x) x)))
        (eqv? p p))))

(title "predicate equal?")
(define (compare-equal?-eqv? x y)
  (if (eqv? x y)
      (equal? x y)
      #t))
(show (and
       (eq? #t #t)
       (eq? #f #f)
       (compare-equal?-eqv? 'a 'a)
       (compare-equal?-eqv? 'a 'b)
       (compare-equal?-eqv? 'lowercase 'LOwERcaSE)
       (compare-equal?-eqv? '() '())
       (compare-equal?-eqv? (cons 1 2) (cons 1 2))
       (let ((lst (cons 1 2)))
         (compare-equal?-eqv? lst lst))
       (compare-equal?-eqv? (lambda () 1) (lambda () 2))
       (compare-equal?-eqv? #f 'nil)
       (let ((p (lambda (x) x)))
         (compare-equal?-eqv? p p))
       (equal? 'a 'a)
       (equal? '(a) '(a))
       (equal? '(a (b) c) '(a (b) c))
       (equal? "abc" "abc")
       (equal? 2 2)))

(title "predicate eq?")
(define (compare-eq?-eqv? x y) (eq? (eq? x y) (eqv? x y)))
(show (and
       (eq? #t #t)
       (eq? #f #f)
       (compare-eq?-eqv? 'a 'a)
       (compare-eq?-eqv? 'a 'b)
       (compare-eq?-eqv? 'lowercase 'LOwERcaSE)
       (compare-eq?-eqv? '() '())
       (compare-eq?-eqv? (cons 1 2) (cons 1 2))
       (let ((lst (cons 1 2)))
         (compare-eq?-eqv? lst lst))
       (compare-eq?-eqv? (lambda () 1) (lambda () 2))
       (compare-eq?-eqv? #f 'nil)
       (let ((p (lambda (x) x)))
         (compare-eq?-eqv? p p))))


(title "closure")
(define (make-balance init)
  (define (make-balance-impl balance transaction-log)
    (lambda (action . args)
      (cond
        ((eq? action 'get-balance) balance)
        ((eq? action 'get-log) (reverse transaction-log))
        ((eq? action 'add) (make-balance-impl (+ balance (car args)) (cons (cons 'add args) transaction-log)))
        ((eq? action 'clear) (make-balance-impl 0 (cons (list 'clear balance) transaction-log)))
        ((eq? action 'revert) (make-balance-impl (revert balance transaction-log (car args)) (cons (cons action args) transaction-log)))
        ((eq? action 'reset) (apply make-balance-impl (reset balance transaction-log (car args))))

        (else (display "unknown action ") (display (cons action args)) (newline) ))))
  (define (reset balance transaction-log k)
    (if (or (null? transaction-log) (<= k 0))
        (list balance transaction-log)
        (cond ((eq? (caar transaction-log) 'add) (reset (- balance (cadar transaction-log)) (cdr transaction-log) (- k 1)))
              ((eq? (caar transaction-log) 'clear) (reset (cadar transaction-log) (cdr transaction-log) (- k 1)))
              ((eq? (caar transaction-log) 'revert) (reset (redo balance (cdr transaction-log) (cadar transaction-log)) (cdr transaction-log) (- k 1))))))
  (define (redo balance transaction-log k)
    (if (or (null? transaction-log) (<= k 0))
        balance
        (cond ((eq? (caar transaction-log) 'add) (redo (+ balance (cadar transaction-log)) (cdr transaction-log) (- k 1)))
              ((eq? (caar transaction-log) 'clear) (redo 0 (cdr transaction-log) (- k 1)))
              ((eq? (caar transaction-log) 'revert) (redo (car (reset balance (cdr transaction-log) (cadar transaction-log))) (cdr transaction-log) (- k 1))))))
  (define (revert balance transaction-log k)
    (car (reset balance transaction-log k)))

  (make-balance-impl init '()))

(define show-balance-details
  (lambda (balance)
    (display "Balance = ")
    (display (balance 'get-balance))
    (newline)
    (display "Transaction log: ")
    (display (balance 'get-log))
    (newline)))

(define account (make-balance 100))
(show-balance-details account)
(define account (account 'add 100))
(show-balance-details account)
(define account (account 'add -20))
(define account (account 'add 5))
(show-balance-details account)
(define account (account 'clear))
(show-balance-details account)
(account 'miaow~~~~ 555 555 "-_-||")
(show-balance-details account)
(define account (account 'revert 1))
(show-balance-details account)
(define account (account 'revert 1))
(show-balance-details account)
(define account (account 'revert 2))
(show-balance-details account)
(define account (account 'reset 5))
(show-balance-details account)