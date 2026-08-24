# [3장] 람다 표현식

💡 노션에서 더 가독성 좋게 확인 가능합니다! *([🔗노션 페이지에서 보기](https://hyper-noise-b36.notion.site/3-3c6c2d48bf008065856bdba3aa4430d4))*

### 3.0 서문
> 
> 
> 
> 이 장에서는 람다 표현식에 대한 전반적인 내용을 다룬다.
> 
> 결과적으로 더 간결하고 유연하며 가독성 있는 코드를 구현하는 방법을 단계적으로 익힐 수 있다.
> 


---

## 3.1 람다란 무엇인가?

Q. **람다 표현식** 이란?

A. 메서드로 전달할 수 있는 익명 함수를 단순화한 것

- 특징
    1. 익명
    → 보통의 매서드와 달리 이름이 없으므로 익명이라 표현한다. 구현해야 할 코드에 대한 걱정거리가 줄어든다.
    2. 함수
    → 람다는 메서드처럼 특정 클래스에 종속되지 않으므로 함수라고 부른다. 하지만 매서드처럼 파라미터 리스트, 바디, 반환 형식, 가능한 예외 리스트를 포함한다.
    3. 전달
    → 람다 표현식을 메서드 인수로 전달하거나 변수로 저장할 수 있다.
    4. 간결성
    → 익명 클래스처럼 많은 코드를 구현할 필요가 없다.

앞서 2장(동작 파리미터화와 익명클래스)에서 확인한 것처럼, 코드를 전달하는 과정에서 코드가 길어지는 문제가 생긴다. ***람다는 이 문제를 해결해 준다!***

EX) Comparator 객체

```java
// 익명 클래스 사용
inventory.sort(new Comparator<Apple>() {
  public int compare(Apple a1, Apple a2) {
    return Integer.compare(a1.getWeight(), a2.getWeight());
  }
});

// 람다 사용
inventory.sort((Apple a1, Apple a2) -> Integer.compare(a1.getWeight(), a2.getWeight()));
```

람다는 세 부분으로 이루어 진다.

1. 파라미터 리스트
2. 화살표
3. 람다 바디

위 예제 코드로 살펴보면 다음과 같다!

```java
                  -화살표-
(Apple a1, Apple a2) -> Integer.compare(a1.getWeight(), a2.getWeight())
----람다 파라미터----     ----------------- 람다 바디 ------------------
```

자바에서 람다의 **문법**은 크게 두 가지 이다. (이미 나온 언어와 비슷한 문법을 모두 채용했다)

1. 표현식 스타일
    
    `(parameters) → expression`
    
2. 블록 스타일
    
    `(parameters) → { statements; }`
    

⇒ 세미콜론이 붙어야 하면 블록 스타일이라고 생각하면 편하다!!

## 3.2 어디에, 어떻게 람다를 사용할까?

Q. 정확히 어디에서 람다를 사용할 수 있는 걸까?

A. 함수형 인터페이스라는 문맥에서 람다 표현식을 사용할 수 있다.

Q. 그럼 함수형 인터페이스가 뭔가요??

A. 다음 절에서 설명!!

### 3.2.1 함수형 인터페이스

**함수형 인터페이스**는 오직 하나의 추상 메서드만 지정하는 인터페이스를 가르킨다.

지난 2장에서 Predicate<T> 인터페이스로 필터 메서드를 파라미터화 할 수 있었고, 바로 요 Predicate<T>가 함수형 인터페이스 이다. 왜냐하면 Predicate<T>가 오직 하나의 추상 메서드만 지정하기 때문이다.

```java
public interface Predicate<T> {
    boolean test(T t);
}
```

Q. 함수형 인터페이스로 무엇을 할 수 있을까?

A. 람다 표현식으로 
     함수형 인터페이스의 추상 메서드 구현을 
     직접 전달할 수 있으므로 
     전체 표현식을 함수형 인터페이스의 인스턴스로 취급할 수 있다.

EX) Runnable이 오직 하나의 추상 메서드 run을 정의하는 함수형 인터페이스 코드

```java
public interface Runnable {
    void run();
}

// 사용 예시
Runnable r = () -> System.out.println("Hello!");
r.run();
```

### 3.2.2 함수 디스크립터

Q. **함수 디스크립터**란?

A. 람다 표현식의 시그니처를 서술하는 매서드를 함수 디스크립터라 부른다.

EX) Runnable 인터페이스의 유일한 추상 메서드 run은 **인수와 반환값이 없으므로** Runnable 인터페이스는 인수와 반환값이 없는 **시그니처**로 생각할 수 있다.

Q. 람다 표현식에 인수와 반환값이 없는지 어떻게 판단하나요? 즉, 람다 표현식의 형식은 어떻게 검사하나요?

A. 3.5절에서 자세히 설명합니다^^

## 3.3 람다 활용 : 실행 어라운드 패턴

자원 처리에 사용하는 순환 패턴을 구현해야 한다고 가정하자.

그럼 1. 자원을 열고 2. 처리한 다음에 3. 자원을 닫는 순서로 순환 패턴을 구현할 것이다.

대부분의 설정과 정리 과정은 비슷하다.

즉, 실제 자원을 처리하는 코드를 설정과 정리 두 과정이 둘러싸는 형태를 갖는다.

이런 형식의 코드를 **실행 어라운드 패턴**이라고 부른다.

```java
public static String processFileLimited() throws IOException {
    try (BufferedReader br = new BufferedReader(new FileReader(FILE))) {
        return br.readLine();
    }
}
```

### 3.3.1 1단계 : 동작 파라미터화를 기억하라

Q. 현재 코드는 한 번에 한 줄만 읽을 수 있다. 그렇다면 한 번에 두 줄을 읽거나 가장 자주 사용되는 단어를 반환하려면 어떻게 해야 할까?

A. 기존의 설정과 정리 과정(실행 어라운드 패턴)은 재사용하고, processFile 매서드만 다른 동작을 수행하도록 명령할 수 있다면 좋다!! → processFile의 동작을 파라미터화 한다!!

```java
String result = processFile((BufferedReader br) -> br.readLine() + br.readLine());
```

### 3.3.2 2단계 : 함수형 인터페이스를 이요해서 동작 전달

함수형 인터페이스 자리에 람다를 사용할 수 있다.

```java
@FunctionalInterface
public interface BufferedReaderProcessor {
    String process(BufferedReader b) throws IOException;
}
```

### 3.3.3 3단계 : 동작 실행

이제 BufferedReaderProcessor에 정의된 process 매서드의 시그니처와 일치하는 람다를 전달할 수 있다.

- Q. 람다의 코드가 processFile 내부에서 어떻게 실행될까?
    
    A. 람다 표현식으로 함수형 인터페이스의 추상 메서드 구현을 직접 전달 할 수 있으며
         전달된 코드는 함수형 인터페이스의 인스턴스로 전달된 코드와 같은 방식으로 처리한다.
    

```java
public static String processFile(BufferedReaderProcessor p) throws IOException {
    try (BufferedReader br = new BufferedReader(new FileReader(FILE))) {
        return p.process(br);
    }
}
```

### 3.3.4 4단계 : 람다 전달

이제 람다를 이용해서 다양한 동작을 processFile 메서드로 전달할 수 있다.

- 한 행을 처리하는 코드
    
    ```java
    String oneLine = processFile((BufferedReader br) -> br.readLine());
    ```
    
- 두 행을 처리하는 코드
    
    ```java
    String twoLines = processFile((BufferedReader br) -> br.readLine() + br.readLine());
    ```
    

## 3.4 함수형 인터페이스 사용

- 함수형 인터페이스의 추상 메서드 → 람다 표현식의 시그니처
- 함수형 인터페이스의 추상 메서드 시그니처 -> **함수 디스크립터**

Q. 왜 함수 디스크립터가 필요한가요?

A. 다양한 람다 표현식을 사용하려면 공통의 함수 디스크립터를 기술하는 함수형 인터페이스 집합이 필요하기 때문이다.

Q. 다양한 람다 표현식은 구체적으로 무엇이 있나요?

A. 도서 105.p, 106.p에 아주아주 많이 있다

대표적으로 계속 예시로 나오던 인터페이스들 Comparable, Runnable, Callable, 그리고 새로 배울 Predicate, Consumer, Function 인터페이스 등등이 있다.

### 3.4.1 Predicate

- `test` 추상 메서드를 정의
- `test`는 제네릭 형식 T의 객체를 인수로 받아 불리언을 반환
- 따로 정의할 필요 없이 바로 사용할 수 있다는 점이 특징
- 사용예) T 형식의 객체를 사용하는 불리언 표현식이 필요한 상황에서 Predicate 인터페이스를 사용할 수 있음!!

```java
// 녹색 사과인지 판별하는 조건으로 람다 전달
List<Apple> greenApples = filter(inventory, (Apple a) -> a.getColor() == Color.GREEN);
```

### 3.4.2 Consumer

- `accept` 추상 메서드를 정의
- `accept`는 제네릭 형식 T 객체를 받아서 void를 반환
- 사용예) T형식의 객체를 인수로 받아서 어떤 동작을 수행하고 싶을 때 Consumer 인터페이스를 사용할 수 있음!!

```java
// 정수 리스트의 각 항목을 출력하는 예제
public <T> void forEach(List<T> list, Consumer<T> c) {
    for(T t: list) {
        c.accept(t);
    }
}
forEach(Arrays.asList(1, 2, 3), (Integer i) -> System.out.println(i));
```

### 3.4.3 Function

- `apply` 추상 메서드를 정의
- `apply`는 제네릭 형식 T를 인수로 받아서 제네릭 형식 R 객체를 반환
- 사용예) 입력을 출력으로 매핑하는 람다를 정의할 때 Function 인터페이스를 활용할 수 있음!!

```java
// String 리스트를 각 String의 길이(Integer) 리스트로 변환하는 예제
public <T, R> List<R> map(List<T> list, Function<T, R> f) {
    List<R> result = new ArrayList<>();
    for(T t: list) {
        result.add(f.apply(t));
    }
    return result;
}
List<Integer> l = map(Arrays.asList("lambdas", "in", "action"), (String s) -> s.length());
```

#### 기본형 특화

자바의 모든 형식은 기본형 아니면 참조형이다.

- 기본형: int, double, byte, char
- 참조형: Byte, Integer, Object, List

제네릭 파라미터(T)에는 참조형만 사용할 수 있다.

- 박싱: 기본형 → 참조형
- 언박싱: 참조형 → 기본형
- 오토박싱: 박싱과 언박싱이 자동으로 이루어지는 기능.

다양한 기본형 특화 함수는 도서의 105.p를 참고하자. (짱많음 주의)

- `(T, U) → R` 같은 표기법으로 함수 디스크립터를 설명할 수 있다.

<aside>
🍀

**[~~요약 타임~~]**

지금까지 람다를 만드는 방법과 람다를 사용하는 방법을 배웠다.

다음으로 컴파일러가 람다의 형식을 어떻게 확인하는지, 피해야 할 사항은 무엇인지*(람다 표현식에서 바디 안에 있는 지역 변수를 참조하지 않아야 하다,  void 호환 람다는 멀리해야 한다 등)* 내용을 살펴보겠따!!

</aside>

## 3.5 형식 검사, 형식 추론, 제약

### 3.5.1 형식 검사

람다가 사용되는 콘텍스트를 이용해서 람다의 형식(타입)을 추론하여 보여지는 람다 표현식의 형식을 **대상 형식**이라 부른다.

*(개인적으로 도서에서 형식이란 단어가 나오면 타입이라고 읽었을 때 이해가 더 편했다.)*

  EX)  
`List<Apple> heavierThan150g = 
 filter(inventory, **(Apple apple) → apple.getWeight() > 150**);`

1. filter 메서드의 선언을 확인한다.
2. filter 메서드는 두 번째 파라미터로  Predicate<Apple> 형식(대상 형식)을 기대한다.
3. Predicate<Apple>은 test라는 한 개의 추상 메서드를 정의하는 함수형 인터페이스이다.
4. test 메서더는 Apple을 받아 boolean을 반환하는 함수 디스크립터를 묘사한다.
5. filter 메서드로 전달된 인수는 이와 같은 요구사항을 만족해야 한다.

### 3.5.2 같은 람다, 다른 함수형 인터페이스

대상 형식이라는 특징 때문에
          **같은** 람다 표현식이더라도
                    **호환**되는 추상 메서드를 가진
                              **다른** 함수형 인터페이스로 사용될 수 있다.

EX) Callabe과 PricilegedAcion 인터페이스는 인수를 받지 않고 제네릭 형식 T를 반환하는 함수를 정의한다. 따라서 다음 두 할당문은 모두 유효하다.

```java
// Callabe 인터페이스
Callabe<Integer> c = () -> 42;

// PricilegedAcion 인터페이스
PricilegedAcion<Integer> p = () -> 42;
```

- **다이아몬드 연산자**: 꺽쇠 괄호이다. <> 이거. 요걸로 콘텍스트에 따른 제네릭 형식을 추론할 수 있다.
    
    ```java
    List<String> listOfStrings = new ArrayList<>();
    ```
    
    요렇게.
    
    코테 풀다 보면 빈번히 선언하던 구문인데 다시 보게 되니 싱기하다. *~~(그동안 아무 생각 없이 꺽쇠 비우니까 비우는 거겠지? 하던 1인)~~*
    
    - 리스트 선언에 대한 추가 공부!!
        
        #### `List` vs `ArrayList` 선언의 차이
        
        ```java
        // 1번 방식 (인터페이스 타입 선언)
        List<String> list = new ArrayList<>();
        
        // 2번 방식 (구현체 타입 선언)
        ArrayList<String> arr = new ArrayList<>();
        ```
        
        1번 방식(`List<>`)을 사용하는 것이 객체지향적인 표준 관례(Best Practice)이다.
        
        - 이유1: 다형성(Polymorphism)과 유연성
            - `List`는 인터페이스이고 `ArrayList`는 그 인터페이스를 구현한 클래스이다.
            - 1번 방식처럼 인터페이스 타입으로 선언하면, 나중에 내부 구현을 `LinkedList` 등으로 바꿔야 할 때 선언부만 `new LinkedList<>()`로 수정하면 된다. (유용!!)
        - 이유2: 메서드 파라미터/반환 타입 호환
            - 특정 메서드를 만들어 리스트를 넘기거나 반환받을 때, 파라미터 타입을 `List<String>`으로 해두면 `ArrayList`, `LinkedList`, `Stack` 등 어떤 `List` 구현체든 유연하게 받을 수 있다.

### 3.5.3 형식 추론

형식 추론이란 것으로 코드를 좀 더 단순화 할 수 있다. 자, 일단 말로 설명해 보자면…

자바 컴파일러는 람다 표현식이 사용된 콘텍스트(대상 형식)를 이용해서
        람다 표현식과 관련된 함수형 인터페이스를 추론한다.
                → 대상 형식을 이용해서 함수 디스크립터를 알 수 있으므로
                          컴파일러는 람다의 시그니처도 추론할 수 있다.
                                  결과적으로, 컴파일러는 람다 표현식의 파라미터 형식에 접근할 수 있으므로
                                          람다 문법에서 이를 **생략**할 수 있다.

⇒요약: 타입 생략 가능

```java
// 형식을 추론하지 않는 코드
inventory.sort((Apple a1, Apple a2) -> a1.getWeight() - a2.getWeight());

// 형식을 추론하는 코드 (파라미터 타입 생략)
inventory.sort((a1, a2) -> a1.getWeight() - a2.getWeight());
```

- 상황에 따라 형식을 추론하는 것이 좋을 때도 있고, 형식을 추론하지 않는게 좋을 때도 있다.
- *정해진 규칙은 없으니*, 스스로 어떤 것이 **가독성**이 더 좋은지 생각해야 한다.

### 3.5.4 지역 변수 사용

- **자유 변수** : 파라미터로 넘겨진 변수가 아닌 외부에서 정의된 변수
- **람다 캡처링** : 람다표현식에서 자유 변수를 활용하는 것

```java
int portNumber = 1337;
Runnable r = () -> System.out.println(portNumber);
```

람다는 인스턴스 변수와 정적 변수를 자유롭게 캡쳐 가능하다.

하지만 지역 변수는 한 번만 할당할 수 있는 것만 캡처 가능하다. *(→ 지역 변수는 명시적으로 final로 선언되어 있거나, final로 선언된 변수와 똑같이 사용되어야 함)*

Why?

A. 인스턴스 변수 → 힙에 저장
     지역 변수 → 스택에 저장
     따라서, 복사본의 값이 바뀌지 않아야 하기 때문에
     지역 변수에는 한 번만 값을 할당해야 한다.

## 3.6 메서드 참조

메서드 참조 = 특정 람다 표현식을 축약한 것.

때로는 람다 표현식보다 메서드 참조를 사용하는 것이 더 가독성이 좋을 수 있다.

### 3.6.1 요약

Q. 메서드 참조가 왜 중요할까?

A. 람다가 ‘이 메서드를 직접 호출해’라고 명령한다면, 메서드를 어떻게 호출해야 하는지 설명을 참조하기 보다는 메서드명을 직접 참조하는것이 편리하다. 이로써 **가독성**을 높일 수 있다.

요약: 가독성을 챙기기 위해 메서드 참조를 사용한다.

Q. 메서드 참조는 어떻게 활용하나요?

A. 메서드명 앞에 구분자(`::`)를 붙이면 된다!!

<aside>
👉

람다 표현식 : `(Apple a) → a.getWeight()`
메서드 참조 : `Apple::getWeight`

</aside>

메서드 참조는 세 가지 유형으로 구분할 수 있다.

1. 정적 메서드 참조
    - EX) Integer의 parseInt 메서드는 `Integer::parseInt`로 표현 가능
2. 다양한 형식의 인스턴스 메서드 참조
    - 람다 표현식의 파라미터로 전달 가능
    - EX)`(String s)→s.toUpperCase()` 람다 표현식을 `String::toUpperCase` 줄이기
3. 기존 객체의 인스턴스 메서드 참조
    - 람다 표현식에서 현존하는 외부 객체의 메서드를 호출할 때 사용
    - EX)`()→expensiveTransaction.getValue()` 람다 표현식을 `expensiveTransaction::getValue` 줄이기

생성자, 배열 생성자, super 호출 등에 사용할 수 있는 특별한 형식의 메서드 참조도 있다. 다음은 배열 예제이다!

> Comparator는 (T, T) → int 함수 디스크립터를 같는다.
> 
> 
> compareToIgnoreCase 메서드로 람다 표현식을 정의할 수 있다.
> 
> ```java
> List<String> str = Arrays.asList("a", "b", "A", "B");
> str.sort((s1, s2) -> s1.compareToIgnoreCase(s2));
> ```
> 
> 이걸 메서드 참조를 사용해서 다음과 같이 줄일 수 있다.
> 
> ```java
> List<String> str = Arrays.asList("a", "b", "A", "B");
> str.sort(String::compareToIgnoreCase);
> ```
> 

다음은 람다 표현식 대신 메서드 참조를 써서 **가독성이 좋아지는 예**이다.

> String을 인수로 받아 파싱한 다음에 Integer을 반환하는 메서드이다.
> 
> 
> ```java
> ToIntFuncion<Stirng> stringToInt = (String s) -> Integer.parseInt(s);
> ```
> 
> ```java
> Funcion<Stirng, Integer> stringToInteger = Integer::parseInt;
> ```
> 

### 3.6.2 생성자 참조

ClassName::new 처럼 클래스명과 new 키워드를 활용해서 기존 생성자의 참조를 만들 수 있다.

```java
// 인수 없는 생성자 예시
Supplier<Apple> c1 = Apple::new;
Apple a1 = c1.get();

// 인수가 있는 생성자 예시
BiFunction<Integer, Color, Apple> c2 = Apple::new;
Apple a2 = c2.apply(110, Color.GREEN);
```

## 3.7 람다, 메서드 참조 활용하기

### 3.7.1 1단계 : 코드 전달

자바8에서 sort 메서드는 `void sort(Comparator<? super E> c)` 시그니처를 갖기 때문에 동작 파라미화 되어 있다.

⇒ sort에 입력할 파라미터에 따라 동작이 달라진다.

```java
// Comparator를 구현한 별도의 클래스 생성
static class AppleComparator implements Comparator<Apple> {
    @Override
    public int compare(Apple a1, Apple a2) {
        return a1.getWeight() - a2.getWeight();
    }
}
inventory.sort(new AppleComparator());
```

### 3.7.2 2단계 : 익명 클래스 사용

```java
// 익명 클래스로 한 번에 사용할 인스턴스 생성
inventory.sort(new Comparator<Apple>() {
    @Override
    public int compare(Apple a1, Apple a2) {
        return a1.getWeight() - a2.getWeight();
    }
});
```

### 3.7.3 3단계 : 람다 표현식 사용

- 추상 메서드의 **시그니처**(=**함수 디스크립터**)는 람다 표현식의 시그니처를 정의 (Apple, Apple) → int
    
    ```java
    // 람다 표현식으로 전환
    inventory.sort((Apple a1, Apple a2) -> a1.getWeight() - a2.getWeight());
    ```
    
- 자바 컴파일러는 람다의 파라미터 **형식을 추론** 할 수 있음
    
    ```java
    // 파라미터 형식 추론
    inventory.sort((a1, a2) -> a1.getWeight() - a2.getWeight());
    ```
    
- comparing 메서드를 사용해서 더 줄일 수 있다
    
    ```java
    // java.util.Comparator.comparing 메서드 활용
    Comparator<Apple> c = Comparator.comparing((Apple a) -> a.getWeight());
    inventory.sort(c);
    ```
    

### 3.7.4 4단계 : 메서드 참조 사용

```java
inventory.sort(comparing(Apple::getWeight));
```

## 3.8 람다 표현식을 조합할 수 있는 유용한 메서드

몇몇 함수형 인터페이스는 다양한 **유틸리티 메서드**와 **디폴트 메서드**를 포함한다.

Q. 유틸리티 메서드란?

A. 일반 클래스 내에 선언되고, 공통 로직(연산, 변환 등)의 모음 제공하며 오버라이딩이 불가능한 메서드.

Q. **디폴트 메서드**란?

A. 간단한 여러 개의 람다 표현식을 조합해서 복잡한 람다 표현식을 만들 수 있게 해 주는 메서드.

### 3.8.1 Comparator 조합

```java
Comparator<Apple> c = Comparator.comparing(Apple::getWeight);
```

Q. 이 코드를 역정렬(내림차순) 하려면 어떻게 해야 할까?

A. **reverse** 디폴트 메서드를 이용한다!

```java
inventory.sort(comparing(Apple::getWeight).reversed());
```

Q. 만약 무게가 같은 사과가 두 개 존재한다면 어떻게 하나요??

A. **thenComparing** 메서드로 두 번째 정렬 조건을 추가할 수 있다!!

```java
inventory.sort(comparing(Apple::getWeight).reversed().thenComparing(Apple::getCountry));
```

### 3.8.2 Predicate 조합

- **negate** 디폴트 메서드
    
    프레디케이트를 반전시킬 때 사용. *(not 혹은 ! 연산과 같음)*
    
    ```java
    Predicate<Apple> notRedApple = redApple.negate();
    ```
    
- **and** 디폴트 메서드
    
    ```java
    Predicate<Apple> redAndHeavyApple = redApple.and(apple -> apple.getWeight() > 150);
    ```
    
- **or** 디폴트 메서드
    
    ```java
    Predicate<Apple> redAndHeavyOrGreen = redApple.and(apple -> apple.getWeight() > 150).or(apple -> apple.getColor() == Color.GREEN);
    ```
    

⇒ 단순한 람다 표현식을 조합해서 더 복잡한 람다 표현식을 만들었기 때문에 유용하다!!

### 3.8.3 Function 조합

- **andThen** 디폴트 메서드
    
    주어진 함수를 먼저 적용한 결과를, 다른 함수의 입력으로 전달하는 함수
    
    ```java
    // g(f(x)) 
    Function<Integer, Integer> h = f.andThen(g);
    ```
    
- **compost** 디폴트 메서드
    
    인수로 주어진 함수를 먼저 실행한 다음에 그 결과를 외부 함수의 인수로 제공하는 함수
    
    ```java
    // f(g(x)) 
    Function<Integer, Integer> h = f.compose(g);
    ```
    

⇒ 이를 이용해 다양한 변환 파이프라인을 만들 수 있다.

## 3.9 비슷한 수학점 개념

**적분**을 람다 표현식으로 구현할 수 있다.

```java
// f(x) = x + 10 인 함수를 3에서 7까지 적분하는 예
integrate((double x) -> x + 10, 3, 7);
```