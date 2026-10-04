# [5장] 스트림 활용

💡 노션에서 더 가독성 좋게 확인 가능합니다! *([🔗노션 페이지에서 보기](https://hyper-noise-b36.notion.site/5-3d0c2d48bf008078a836eb13dba93830))*

### 5.0 서문
> 
> 
> 
> 이 장에서는 필터링, 슬라이싱, 검색, 매칭, 매핑, 리듀싱 등 다양한 패턴을 살펴봅니다.
> 

---

## 5.1 필터링

### 5.1.1 프레디케이트 필터링

> 
> 
> 
> **filter**
> 

```java
// 모든 채식 요리를 필터링 하는 코드
List<Dish> vegetarianMenu = menu.stream()
    .filter(Dish::isVegetarian)
    .collect(toList());
```

- 프레디케이스를 인수로 받아서,
- 프레디케이트와 일치하는 모든 요소를 포함하는 스트림을 반환함

### 5.1.2 고유 요소 필터링

> 
> 
> 
> **ditinct**
> 

```java
// 모든 짝수를 선택하고 중복을 필터링하는 코드
List<Integer> numbers = Arrays.asList(1, 2, 1, 3, 3, 2, 4);
numbers.stream()
    .filter(i -> i % 2 == 0)
    .distinct()
    .forEach(System.out::println);
```

- filter + 중복 제외

## 5.2 스트림 슬라이싱

스트림 요소를 선택하거나 스킵하는 방법을 알아본다!!

### 5.2.1 프레디케이트를 이용한 슬라이싱

> 
> 
> 
> **takeWhile**
> 

```java
// 320칼로리 이하의 요리를 선택하는 코드
List<Dish> slicedMenu1 = specialMenu.stream()
    .takeWhile(dish -> dish.getCalories() < 320)
    .collect(toList());
```

- filter VS takeWhile
    - filter - 전체 스트림을 반복하면서 각 요소에 프레디케이트를 적용
    - takeWhile - 리스트가 이미 정렬되어 있다는 사실을 이용해, 320칼로리보다 크거나 같은 요리가 나왔을 때 반복 작업을 중단.
        
        요약: break가 자동임.
        

> 
> 
> 
> **dropWhile**
> 

```java
// 320칼로리 보다 큰 요소(나머지 요소) 선택 코드
List<Dish> slicedMenu2 = specialMenu.stream()
    .dropWhile(dish -> dish.getCalories() < 320)
    .collect(toList());
```

- takeWhile과 정반대
- 프레디케이트가 처음으로 **거짓**이 되는 지점까지 발견된 요소를 버림.

### 5.2.2 스트림 축소

> 
> 
> 
> **limit(n)**
> 

```java
// 300 칼로리 이상의 세 요리를 선택하는 코드
List<Dish> dishesLimit3 = menu.stream()
    .filter(d -> d.getCalories() > 300)
    .limit(3)
    .collect(toList());
```

- 주어진 값 이하의 크기를 갖는 새로운 스트림을 반환

### 5.2.3 요소 건너뛰기

> 
> 
> 
> **skip(n)**
> 

```java
// 300 칼로리 이상의 첫 두 요리를 건너뛴 다음에 300 칼로리가 넘는 나머지 요리 반환
List<Dish> dishesSkip2 = menu.stream()
    .filter(d -> d.getCalories() > 300)
    .skip(2)
    .collect(toList());
```

- 처음 n개의 요소를 제외한 스트림을 반환

## 5.3 매핑

### 5.3.1 스트림의 각 요소에 함수 적용하기

> 
> 
> 
> **map**
> 

```java
// 스트림의 각 요리명 추출 및 단어 길이 추출 코드
List<String> dishNames = menu.stream()
    .map(Dish::getName)
    .collect(toList());

List<String> words = Arrays.asList("Hello", "World");
List<Integer> wordLengths = words.stream()
    .map(String::length)
    .collect(toList());
```

- 함수를 인수로 받음
- 인수로 제공된 함수는 각 요소에 적용됨.

Q. 어째서 “변환”이 아닌 “매핑”일까?

A. “변환”은 ‘고친다’에 가깝고, “매핑”은 ‘새로운 버전을 만든다’ 이다. 따라서 map은 매핑이다.

### 5.3.2 스트림 평면화

고유 문자(중복X 리스트)로 이루어진 리스트를 반환하는 코드를 만들어보겠다.

[”Hello”, “World”] 리스트의 고유 문자 리스트를 반환해 보자.

```java
// map과 distinct를 활용한 잘못된 코드
List<String[]> uniqueCharacters = words.stream()
    .map(word -> word.split("")) // 결과로 Stream<String[]> 반환
    .distinct()
    .collect(toList());
```

map이 반환한 스트림 형식은 Stream<String[]> 이다.

→ Q. Stream<String>을 반환하려면 어떻게 해야 할까?

A. **flatMap**을 사용한다!!

> 
> 
> 
> **flatMap**
> 

```java
// [”Hello”, “World”] 리스트의 고유 문자 리스트 반환 코드[cite: 9]
words.stream()
    .flatMap((String line) -> Arrays.stream(line.split("")))
    .distinct()
    .forEach(System.out::println);
```

- 생성된 리스트를 하나의 스트림으로 **평면화** 한다.

⇒ 리스트(대괄호) 하나를 벗겨준다고 생각하면 편함!!

## 5.4 검색과 매칭

특정 속성이 데이터 집합에 있는지 여부를 검색하는 방법을 알아본다!!

### 5.4.1 프레디케이트가 적어도 한 요소와 일치하는지 확인

> 
> 
> 
> **anyMatch**
> 

```java
// menu에 채식 요리가 있는지 확인하는 예제
boolean isVegetarianFriendlyMenu = menu.stream().anyMatch(Dish::isVegetarian);
```

- **적어도** 한 요소와 **일치**하는지 확인 할 때 사용.
- 최종연산 이다.

### 5.4.2 프레디케이트가 모든 요소와 일치하는지 검사

> 
> 
> 
> **allMatch**
> 

```java
// 모든 요리가 1000 칼로리 이하인지 확인하는 코드
boolean isHealthyMenu = menu.stream().allMatch(d -> d.getCalories() < 1000);
```

- **모든** 요소가 주어진 프레디케이트와 **일치**하는지 검사
- 최종연산 이다.

> 
> 
> 
> **nonMatch**
> 

```java
// allMatch 예제 코드에서 메서드만 noneMatch로 바꾼 코드
boolean isHealthyMenu2 = menu.stream().noneMatch(d -> d.getCalories() >= 1000);
```

- **모든** 요소가 주어진 프레디케이트와 **불일치**하는지 검사
- 최종연산 이다.

<aside>
👉

anyMatch, allMatch, nonMatch 모두 **쇼트서킷**(&&, ||) 기법 연산을 활용한다.

Q. 쇼트서킷이란?

A. 모든 스트림의 요소를 처리하지 않고도 결과를 반환할 수 있는 것. 예를 들어 표현식에서 하나라도 거짓이라면 나머지 표현식의 결과는 상관없이 전체 결과가 거짓이 되는 것.

</aside>

### 5.4.3 요소 검색

> 
> 
> 
> **findAny**
> 

```java
// 채식 요리 선택하는 코드
Optional<Dish> dish = menu.stream()
    .filter(Dish::isVegetarian)
    .findAny();
```

- **임의**의 요소를 반환
- 최종연산 이다.

<aside>
👉

**Optional** 이란?

findAny는 아무 요소도 반환하지 않을 수 있다.

     null은 쉽게 에러를 일으킬 수 있으므로, 

          null이 반환될 가능성이 있는 경우 에러를 방지하기 위해 Optional을 쓴다.

*→ 자세한 동작은 10장에서 확인!*

</aside>

### 5.4.4 첫 번째 요소 찾기

> 
> 
> 
> **findFirst**
> 

```java
// 숫자 리스트에서 3으로 나누어 떨어지는 첫 번째 제곱값을 반환하는 코드
List<Integer> someNumbers = Arrays.asList(1, 2, 3, 4, 5);
Optional<Integer> firstSquareDivisibleByThree = someNumbers.stream()
    .map(n -> n * n)
    .filter(n -> n % 3 == 0)
    .findFirst();
```

- 논리적인 아이템 순서가 정해져 있을 때, **첫 번째 요소**를 찾고자 할 때 사용한다.
- 최종연산 이다.

Q. 왜 findFirst와 findAny가 필요할까?

A. 병렬성 때무에 실행 시 첫 번째 요소를 찾기 어렵기 때문이다. 두 메서드를 사용하면 이러한 문제를 해결해 준다.

## 5.5 리듀싱

리듀싱 연산 - 모든 스트림 요소를 처리해서 값으로 도출하는 연산

EX) 메뉴의 모든 칼로리 합계를 구하시오, 메뉴에서 칼로리가 가장 높은 요리는?

### 5.5.1 요소의 합

for-each 루프 VS reduce

- for-each 루프
    
    ```java
    int sum = 0;
    for (int x : numbers) {
    	sum += x;
    }
    ```
    
- reduce
    
    ```java
    // 람다 함수 버전
    int sum = numbers.stream().reduce(0, (a, b) -> a + b);
    
    // 매서드 참조 버전
    int sum = numbers.stream().reduce(0, Integer::sum);
    ```
    
    1. 초깃값 0
    2. 두 요소를 조합해서 새로운 값을 만드는 BinaryOperator<T>
    
    ```java
    // 초깃값이 없는 reduce 사용법
    Optional<Integer> sum = numbers.stream().reduce((a, b) -> (a + b));
    ```
    
    - 스트림에 아무 요소가 없을 경우 null이 반환 될 수 있으므로 Optional 반환값 사용.

### 5.5.2 최댓값과 최솟값

```java
// 최댓값
Optional<Integer> sum = numbers.stream().reduce(Integer::max);

// 최솟값
Optional<Integer> sum = numbers.stream().reduce(Integer::min);
```

<aside>
📖

[reduce 메서드의 병렬화]

stream()을 parallelStream()으로 바꾸면 스트림의 모든 요소를 더하는 코드를 병렬로 만들 수 있다.

`int sum = numbers.parallelStream().reduce(0, Integer::sum);`

이렇게 병렬로 실행하면 대가를 지불해야 한다.
      reduce에 넘겨준 람다의 상태가 바뀌지 않아야 하며,
            연산이 어떤 순서로 실행되더라도 결과가 바뀌지 않는 구조이어야 한다.

*→ 7장에서 자세히 설명!!*

</aside>

<aside>
📎

도서 p.176에 스트림 연산 표로 정리되어 있음. (아주아주 많음)

</aside>

## 5.6 실전 연습

트랜잭션 실행 예제를 살펴본다!!

다음 문제를 풀어보자!!

1. 2011년에 일어난 모든 트랜잭션을 찾아 값을 오름차순으로 정리하시오.
2. 거래자가 근무하는 모든 도시를 중복 없이 나열하시오.
3. 케임브리지에서 근무하는 모든 거래자를 찾아서 이름순으로 정렬하시오.
4. 모든 거래자의 이름을 알파벳순으로 정렬해서 반환하시오.
5. 밀라노에 거래자가 있는가?
6. 케임브리지에 거주하는 거래자의 모든 트랜잭션값을 출력하시오.
7. 전체 트랜잭션 중 최댓값은 얼마인가?
8. 전체 트랜잭션 중 최솟값은 얼마인가?

### 5.6.1 거래자와 트랜잭션

```java
// 거래자 리스트와 트랜잭션 리스트 데이터들 선언
Trader raoul = new Trader("Raoul", "Cambridge");
Trader mario = new Trader("Mario", "Milan");
Trader alan = new Trader("Alan", "Cambridge");
Trader brian = new Trader("Brian", "Cambridge");

List<Transaction> transactions = Arrays.asList(
    new Transaction(brian, 2011, 300),
    new Transaction(raoul, 2012, 1000),
    new Transaction(raoul, 2011, 400),
    new Transaction(mario, 2012, 710),
    new Transaction(mario, 2012, 700),
    new Transaction(alan, 2012, 950)
);

// Trader와 Transaction 클래스 정의 선언
public class Trader {
  private String name;
  private String city;
  public Trader(String n, String c) {
    this.name = n;
    this.city = c;
  }
  public String getName() { return name; }
  public String getCity() { return city; }
}

public class Transaction {
  private Trader trader;
  private int year;
  private int value;
  public Transaction(Trader trader, int year, int value) {
    this.trader = trader;
    this.year = year;
    this.value = value;
  }
  public Trader getTrader() { return trader; }
  public int getYear() { return year; }
  public int getValue() { return value; }
}
```

### 5.6.2 실전 연습 정답

```java
// 2011년부터 발생한 모든 거래를 찾아 값으로 정렬(작은 값에서 큰 값)
List<Transaction> tr2011 = transactions.stream()
    .filter(transaction -> transaction.getYear() == 2011)
    .sorted(comparing(Transaction::getValue))
    .collect(toList());

// 거래자가 근무하는 모든 고유 도시는?
List<String> cities = transactions.stream()
    .map(transaction -> transaction.getTrader().getCity())
    .distinct()
    .collect(toList());

// Cambridge의 모든 거래자를 찾아 이름으로 정렬.
List<Trader> traders = transactions.stream()
    .map(Transaction::getTrader)
    .filter(trader -> trader.getCity().equals("Cambridge"))
    .distinct()
    .sorted(comparing(Trader::getName))
    .collect(toList());

// 알파벳 순으로 정렬된 모든 거래자의 이름 문자열을 반환
String traderStr = transactions.stream()
    .map(transaction -> transaction.getTrader().getName())
    .distinct()
    .sorted()
    .reduce("", (n1, n2) -> n1 + n2);

// Milan에 거주하는 거래자가 있는가?
boolean milanBased = transactions.stream()
    .anyMatch(transaction -> transaction.getTrader().getCity().equals("Milan"));

// Cambridge에 사는 거래자의 모든 거래내역 출력.
transactions.stream()
    .filter(t -> "Cambridge".equals(t.getTrader().getCity()))
    .map(Transaction::getValue)
    .forEach(System.out::println);

// 모든 거래에서 최고값은 얼마인가?
int highestValue = transactions.stream()
    .map(Transaction::getValue)
    .reduce(0, Integer::max);

// 가장 작은 값을 가진 거래 탐색
Optional<Transaction> smallestTransaction = transactions.stream()
    .min(comparing(Transaction::getValue));
```