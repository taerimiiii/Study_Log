# [4장] 스트림 소개

💡 노션에서 더 가독성 좋게 확인 가능합니다! *([🔗노션 페이지에서 보기](https://hyper-noise-b36.notion.site/4-3d0c2d48bf008085a207fec73959c6ea))*


## 4.1 스트림이란 무엇인가?

1. 스트림을 이용하면 선언형으로 컬렉션 데이터를 처리할 수 있다.
    
    = 컬렉션을 좀 더 쉽게 다룰 수 있다.
    
2. 스트림을 이용하면 멀티스레드 코드를 구현하지 않아도 데이터를 투명하게 병렬로 처리할 수 있다.

- 자바7 코드(스트림 적용 전, 가비지 변수와 익명 클래스 활용)
    
    ```java
    List<Dish> lowCaloricDishes = new ArrayList<>();
    for (Dish dish: menu) {
    	if (dish.getCalories() < 400) {
    		lowCaloricDishes.add(dish);
    	}
    }
    Collections.sort(lowCaloricDishes, new Comparator<Dish>() {
    	public int compare(Dish dish1, Dish dish2) {
    		return Integer.compare(dish1.getCalories(), dish2.getCalories());
    });
    List<String> lowCaloricDishesName = new ArrayList<>();
    for (Dish dish: lowCaloricDishes) {
    	lowCaloricDishesName.add(dish.getName());
    }
    ```
    
- 자바8 코드(스트림 적용)
    
    ```java
    List<String> lowCaloricDishesName = menu.stream()
        .filter(d -> d.getCalories() < 400)
        .sorted(comparing(Dish::getCalories))
        .map(Dish::getName)
        .collect(toList());
    ```
    

- 고수준 빌딩 블록
    - filter, sorted, map, collect 같은 스트림 API 연산들을 가리킨다.
    - 자유롭게 어떤 상황에서든 사용 할 수 있다 → 즉, 병렬에 유리하다.

<aside>
🍀

[앞으로 배울 것!]

1. 짝수 스트림이나 피타고라스 삼각형 숫자 스트림을 만드는 법
2. 파일 등의 **소스**를 이용해서 스트림을 만드는 방법
3. 무제한의 요소로 스트림을 만드는 방법

⇒ 모두 컬렉션으로는 불가능한 것들!! 스트림으로는 가능!!

</aside>

## 4.2 스트림 시작하기

Q. 스트림이란?

A. 데이터 처리 연산을 지원하도록 소스에서 추출된 연속된 요소 이다.

Q. 연속된 요소 란?

A. 특정 요소 형식으로 이루어진 연속된 값 집합의 인터페이스를 제공하는 것 (요약: 리스트, 배열)

> 컬렉션과 스트림의 비교
> 
> - 컬렉션 - 시간과 공간의 복잡성과 관련된 **요소 저장** 및 **접근 연산.** *(데이터가 주제)*
> - 스트림 - iflter, soreted, map 과 같은 **표현 계산식.** *(계산이 주제)*

Q. 소스란?

A. 리스트로 스트림을 만들면 스트림의 요소는 리스트의 요소와 같은 순서를 유지한다.

요약: 스트림 만들면 순서 변동이 없다.

<aside>
🔥

스트림의 특징

1. **파이프라이닝**
    
    스트림 연산은
         스트림 연산끼리 연결해서
              커다란 파이프라인을 구성할 수 있도록
                   스트림 자신을 반환한다.
    
    *→ **게으름**, **쇼트서킷** 최적화 (5장에서 배움)*
    
2. **내부 반복**
    - 컬렉션: 외부 반복(=명시적 반복)
    - 스트림: 내부 반복
    
    *→ 4.3.2절 참고*
    
</aside>

- 파이프라인 형성 코드

```java
List<String> names = menu.stream()
    .filter(dish -> dish.getCalories() > 300)
    .map(Dish::getName)
    .limit(3)
    .collect(toList());
```

1. collect를 제외한 모든 연산은 서로 파이프라인을 형성할 수 있도록 스트림을 반환한다.
2. 마지막으로 collect 연산으로 파이프라인을 처리해서 결과를 반환한다.
3. 마지막에 collect를 호출하기 전까지는 menu에서 무엇도 선택되지 않으며 출력 결과도 없다.

→ 요약: 저장을 효율적으로 처리하며 연산을 수행할 수 있다.

## 4.3 스트림과 컬렉션

스트림과 컬렉션 모두 **연속된** 자료구조 인터페이스이다.

**연속됨**이란 **순차적으로 값에 접근**하다는 것을 의미한다.

그렇다면 두 개의 차이점은 무엇일까?

비유하자면 컬렉션은 DVD이고, 스트림은 인터넷 스트리밍이다.

즉, **데이터를 언제 계산**하느냐가 가장 큰 차이이다.

> 
> 
> - 컬렉션
>     - 현재 자료구조가 포함하는 **모든** 값을 메모리에 저장.
>     - 생성자 중심 생성 (적극적 생성)
> - 스트림
>     - **요청할 때만 요소를 계산**하는 고정된 자료구조.
>     - 생산자와 소비자 관계 형성.
>     - 쉽게 말해 **게으르게** 만들어지는 컬렉션

### 4.3.1 딱 한 번만 탐색할 수 있다.

스트림은 한 번만 탐색할 수 있다.

= 탐색된 스트림 요소는 소비된다.

= 다시 탐색하려면 새로운 스트림을 만들어야 한다.

```java
// 똑같은 스트림 두 번 출력하는 코드
List<String> names = Arrays.asList("Java8", "Lambdas", "In", "Action");
Stream<String> s = names.stream();
s.forEach(System.out::println);
// 스트림은 한 번 만 소비할 수 있으므로 아래 행의 주석을 제거하면 IllegalStateException이 발생
//s.forEach(System.out::println);
```

### 4.3.2 외부 반복과 내부 반복

> 
> 
> - 컬렉션 - 외부 반복
> - 스트림 - 내부 반복

```java
// 컬렉션 for-each 외부 반복 루프
List<String> names = new ArrayList<>();
for (Dish dish : menu) {
    names.add(dish.getName());
}
```

```java
// 스트림 내부 반복 코드
List<String> names = menu.stream()
    .map(Dish::getName)
    .collect(toList());
```

Q. 내부 반복의 장점은?

A. 작업을 투명하게 병렬로 처리하거나 더 최적화된 다양한 순서로 처리 할 수 있다.

요약: 병렬 처리에 용이하다

## 4.4 스트림 연산

- 중간 연산 - 연결 할 수 있는 스트림 연산. EX) filter, map, limit
- 최종 연산 - 스트림을 닫는 연산. EX) collect, count

### 4.4.1 중간 연산

- 최종 연산을 스트림 파이프라인에 실행하기 전까지 아무 연산도 수행하지 않는 특징을 가진다.
- = 게으르다 → 최적화 효과를 얻을 수 있음.
- 중간 연산을 합친 다음에 합쳐진 중간 연산을 최종 연산으로 한 번에 처리함.

```java
// 1. 300 칼로리가 넘는 요리는 여러 개지만 오직 처음 3개만 선택됨.
// 2. filter와 map은 서로 다른 연산이지만 한 과정으로 병합됨 (쇼트서킷 & 루프 퓨전)
List<String> names = menu.stream()
    .filter(dish -> {
      System.out.println("filtering " + dish.getName());
      return dish.getCalories() > 300;
    })
    .map(dish -> {
      System.out.println("mapping " + dish.getName());
      return dish.getName();
    })
    .limit(3)
    .collect(toList());
System.out.println(names);
```

### 4.4.2 최종 연산

- 스트림 파이프라인에서 결과를 도출한다.

### 4.4.3 스트림 이용하기

<aside>
👉

[스트림 이용 과정]

1. 질의를 수행할 데이터 소스 (like 컬렉션)
2. 스트림 파이프라인을 구성할 중간 연산 연결
3. 스트림 파이프라인을 실행하고 결과를 만들 최종 연산
</aside>

## 4.5 로드맵

*4장에서는 스트림을 이용해서 외부 반복을 내부 반복으로 바꾸는 방법을 알아봤다.*

*5장에서 필터링, 슬라이싱, 검색, 매칭, 매핑, 리듀싱 등 다양한 패턴을 살펴본다*

*6장에서 데이터 수집 방법을 알아본다.*

## 4.6 마치며

요약인데 패스하겠음.