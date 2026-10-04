# [6장] 스트림으로 데이터 수집

💡 노션에서 더 가독성 좋게 확인 가능합니다! *([🔗노션 페이지에서 보기](https://hyper-noise-b36.notion.site/6-3ddc2d48bf0080569718fb921b20904f))*

<aside>

#### “6장-스트림으로 데이터 수집”의 내용

1. Collectores 클래스로 컬렉션을 만들고 사용하기
2. 하나의 값으로 데이터 스트림 리듀스하기
3. 특별한 리듀싱 유약 연산
4. 데이터 그룹화와 분할
5. 자신만의 커스텀 컬렉터 개발
</aside>

> ~지금까지 내용 요약~
> 
> - 스트림 : DB연산과 유사한 연산을 수행 가능한 것. 특징은 **게으르**다!
> - 중간연산 : 스트림 요소 소비 X    예) filter, map…
> - 최종연산 : 스트림 요소 소비 O   예) count, findFist, forEach, reduce, collect…

- 컬렉션(Collection) : 인터페이스 → `java.util.Collection` (List, Set, Queue 등)
- 컬렉터(Collector) : 인터페이스 → `java.util.stream.Collector`
- collect : 스트림 메서드, 최종연산

⇒ collect 매서드를 이용하면 코드 길이가 짧아진다. 이걸 어떻게 구현하는지 이번 장에서 배울 것!!

## 6.1 컬렉터란 무엇인가?

- 명령어 프로그래밍 : 하나하나 명령이 필요하다. 간단한 작업임에도 코드가 길어진다.
- 함수형 프로그래밍: ‘무엇’을 원하는지 명시가 가능하다. 코드가 간결해지며, 조합성과 재사용성이 뛰어나다. → collect를 사용하는 프로그래밍을 명칭한다.

### 6.1.1 고급 리듀싱 기능을 수행하는 컬렉터

collect를 호출하면 컬렉터로 파라미터화된 **리듀싱 연산**이 수행된다.

→ 명령형 프로그래밍에서는 직접 하나하나 구현해야 했지만, collect를 사용하면 자동으로 작업이 수행된다.

*(내부에서 자동으로 수행되는 작업은 도서 200.p의 그림을 보면 이해하기 쉽다)*

### 6.1.2 미리 정의된 컬렉터

우선, 미리 정의된 컬렉터(EX: groupingBy), 즉 Collectors 클래스에서 제공하는 팩토리 매서드의 기능부터 익혀보자.

*(미리 정의되지 않은 컬렉터 = 커스텀 컬렉터는 곧 나올 예정~..)*

<aside>

[Collectors에서 제공하는 매서드 기능 세가지]

1. 스트림 요소를 하나의 값으로 리듀싱하고 **요약**
2. 스트림 요소 **그룹화**
3. 스트림 요소 **분할**
</aside>

## 6.2 리듀싱과 요약

- 컬렉터의 기능 : 스트림의 항목을 → 컬렉션으로 재구성 할 수 있음.

*⇒ 요약: 컬렉터로 스트림의 모든 항목을 하나의 결과로 합칠 수 있다. EX) counting*

### 6.2.1 스트림값에서 최댓값과 최솟값 검색

- Collectors.maxBy : 스트림의 최댓값 계산
- Collertors.minBy : 스트림의 최솟값 계산

⇒ **요약** 연산 : 합계, 평균 연산 등등…

### 6.2.2 요약 연산

> Collectors.summingInt → 객체를 int로 매핑하는 함수를 인수로 받고, 인수로 전달된 함수는 객체를 int로 매핑한 컬렉터를 반환함.
> 

```java
// 메뉴 리스트의 총 칼로리 계산 코드
int totalCalories = menu.stream().collect(summingInt(Dish::getCalories));
```

- 합계 요약 연산 : Collectors.summing**Int**, Collectors.summing**Long**, Collectors.summing**Double**
- 평균값 계산 요약 연산 : Collectors.averaging**Int**, Collectors.averaging**Long**, Collectors.averaging**Double**

> sum**marizing**Int → 한 방에 요소 수, 합계, 평균, 최댓값, 최솟값 계산하여 반환.
> 

```java
// 메뉴에 있는 요리들의 요약 통계 계산
IntSummaryStatistics menuStatistics = menu.stream().collect(summarizingInt(Dish::getCalories));
System.out.println(menuStatistics);
```

출력 결과
`IntSummaryStatistics{count=9, sum=4300, min=120, average=477.777778, max=800}`

### 6.2.3 문자열 연결

> 
> 
> 
> joining → 스트림의 각 객체에 toString 메서드를 호출해서 / 추출한 모든 문자열을 하나의 문자열로 연결해서 반환함.
> 

```java
// 메뉴의 모든 요리명을 연결
String shortMenu = menu.stream().map(Dish::getName).collect(joining());
// 결과: porkbeefchickenfrench friesriceseason fruitpizzaprawnssalmon

// 요리명 리스트를 콤마로 구분
String shortMenuCommaSeparated = menu.stream().map(Dish::getName).collect(joining(", "));
// 결과: pork, beef, chicken, french fries, rice, season fruit, pizza, prawns, salmon
```

- 제네릭 와일드카드 ‘?’ : 누적자의 형식이 자유로움을 의미.

### 6.2.4 범용 리듀싱 요약 연산

지금까지 살펴본 모든 컬렉터는 reducing 팩토리 메서드로도 정의할 수 있다.

Q. 그럼 왜 컬렉터를 사용하나요?

A. 프로그래밍적 **편의성** 때문이다.

- 이러한 함수형 프로그래밍은 하나의 연산을 다양한 방법으로 해결 할 수 있음을 보여준다.
- 컬렉션 프레임워크는 유연하다. 하지만 코드 길이가 짧은 것과 별개로, 코드가 복잡하다.
- 하지만 더 복잡한 대신, 재사용성과 커스터마이즈 가능성이 제공되며, 추상화 일반화 수준이 높다.

⇒ 그러므로, 상황에 맞는 최적의 해법을 선택해 사용하도록 하자.

## 6.3 그룹화

- 그룹화 : 데이터 집합을 하나 이상의 특성으로 분류하는 연산

```java
// Dish메뉴를 Type으로 groupingBy 연산
Map<Dish.Type, List<Dish>> dishesByType = menu.stream().collect(groupingBy(Dish::getType));

// Map 결과
// {OTHER=[french fries, rice, season fruit, pizza], 
//  MEAT=[pork, beef, chicken], 
//  FISH=[prawns, salmon]}
```

- 분류함수 : 스트림이 그룹화 되는 것 EX) groupinBy - 각 키에 대응하는 리스트를 값으로 가짐.

### 6.3.1 그룹화된 요소 조작

```java
// 일반 filter를 활용한 500칼로리가 넘는 요리 필터링
Map<Dish.Type, List<Dish>> caloricDishesByType = menu.stream()
    .filter(dish -> dish.getCalories() > 500)
    .collect(groupingBy(Dish::getType));

// 맵 결과 (FISH 키 자체가 사라짐)
// {OTHER=[french fries, pizza], MEAT=[pork, beef]}
```

필터 프레디케이트를 만족하는 FISH 종류 요리는 없으므로 결과 맵에서 해당 키 자체가 사라지는 문제점이 있다.

→ 이를 해결하기 위해 groupingBy 메서드를 오버로드해 사용한다.

```java
// groupingBy와 filtering을 써서 해결한 코드
Map<Dish.Type, List<Dish>> groupCaloricDishesByType = menu.stream().collect(
    groupingBy(Dish::getType,
        filtering(dish -> dish.getCalories() > 500, toList())));

// 결과 맵 (FISH 키가 빈 리스트로 보존됨)
// {OTHER=[french fries, pizza], MEAT=[pork, beef], FISH=[]}
```

- flatMapping 이용해 각 형식의 요리 태그 추출 가능하다.

```java
// flatMapping 이용한 코드
Map<Dish.Type, Set<String>> dishTagsByType = menu.stream().collect(
    groupingBy(Dish::getType,
        flatMapping(dish -> dishTags.get(dish.getName()).stream(), toSet())));
```

평면화(flatMap)하고, 중복을 제거한다.

### 6.2.3 다수준 그룹화

- 두 인수를 받는 gropingBy로 다수준 그룹화가 가능하다.

```java
// 두 인수를 받는 groupingBy로 다수준 그룹화 (요리 종류와 칼로리 레벨)
Map<Dish.Type, List<Dish Map<CaloricLevel,>>> dishesByTypeAndCaloricLevel = 
    menu.stream().collect(
        groupingBy(Dish::getType,
            groupingBy((Dish dish) -> {
              if (dish.getCalories() <= 400) return CaloricLevel.DIET;
              else if (dish.getCalories() <= 700) return CaloricLevel.NORMAL;
              else return CaloricLevel.FAT;
            })
        )
    );
```

n수준 그룹화의 결과는 / n수준 트리 구조로 표현되는 n수준 맵이 된다. *(이뭔말 싶지만… 도서 215.p 그림을 보면 이해가 쉽다)*

⇒ 요약 : groupingBy 연산 = 버킷(물건 담는 양동이) 이렇게 이해하면 편하다.

### 6.3.3 서브그룹으로 데이터 수집

```java
// groupingBy 컬렉터에 두 번째 인수로 counting 컬렉터를 전달해서 종류별 요리 수 계산
Map<Dish.Type, Long> typesCount = menu.stream().
														collect(groupingBy(Dish::getType, counting()));
```

```java
// 요리의 종류를 분류하는 컬렉터로 메뉴에서 가장 높은 칼로리를 가진 요리 찾기
Map<Dish.Type, Optional<Dish>> mostCaloricByType = menu.stream().collect(
    groupingBy(Dish::getType,
        reducing((Dish d1, Dish d2) -> 
		        d1.getCalories() > d2.getCalories() ? d1 : d2)));
```

→ 그룹화의 결과로, 키는 요리의 종류, 값은 Optional<Dish> 인 맵이 반환됨.

```java
// 그룹화 결과 맵
// {OTHER=Optional[pizza], MEAT=Optional[pork], FISH=Optional[salmon]}
```

→ 마지막 그룹화 연산에서 값을 Optional로 감쌀 필요는 없다.

→ 이는 collectingAndThen 연산으로 Optional를 삭제할 수 있다.

```java
// collectingAndThen 연산으로 Optional를 삭제한 코드
Map<Dish.Type, Dish> mostCaloricDishesByTypeWithoutOprionals = menu.stream().collect(
    groupingBy(Dish::getType,
        collectingAndThen(
            reducing((d1, d2) -> d1.getCalories() > d2.getCalories() ? d1 : d2),
            Optional::get)));

// 맵의 결과
// {OTHER=pizza, MEAT=pork, FISH=salmon}
```

*(중첩 컬렉터의 동작 순서는 도서 217.p의 짱멋진 그림을 보면 이해가 쉽다.)*

### 6.3.4 다른 컬렉터 예제

> mapping
> 
> 
> → 스트림의 인수를 변환하는 함수와 / 변환 함수의 결과 객체를 누적하는 컬렉터를 인수로 받음.
> 
> → 입력 요소를 누적하기 전에 / 매핑 함수를 적용해서 / 다양한 형식의 객체를 / 주어진 형식의 컬렉터에 맞게 변환하는 역할.
> 

```java
// 각 요리 형식에 존재하는 모든 CaloricLevel 값을 매핑
Map<Dish.Type, Set<CaloricLevel>> caloricLevelsByType = menu.stream().collect(
    groupingBy(Dish::getType, mapping(
        dish -> {
          if (dish.getCalories() <= 400) return CaloricLevel.DIET;
          else if (dish.getCalories() <= 700) return CaloricLevel.NORMAL;
          else return CaloricLevel.FAT;
        },
        toSet()
    ))
);

// 맵 결과
// {OTHER=[DIET, NORMAL], MEAT=[DIET, NORMAL, FAT], FISH=[DIET, NORMAL]}
```

효과EX) 생선을 먹으면서 다이어트를 하고 싶다면 어떤 메뉴를 선택해야 할지 쉽게 구분 할 수 있다.

## 6.4 분할

분할 함수 : 프레디케이트를 분류 함수로 사용하는 특수한 그룹화 기능. **불리언을 반환**함.

→ 따라서 분할 함수를 사용하면 **총 두 개의 그룹**으로 분류된다.

```java
// 채식주의자를 위한 채식 요리와 채식이 아닌 요리 분류
Map<Boolean, List<Dish>> partitionedMenu = menu.stream()
											.collect(partitioningBy(Dish::isVegetarian));

// 맵 결과
// {false=[pork, beef, chicken, prawns, salmon], 
//  true=[french fries, rice, season fruit, pizza]}
```

### 6.4.1 분할의 장점

→ 참, 거짓 두 가지 요소의 스트림 리스트를 모두 유지한다.

- 컬렉터를 두 번째 인수로 전달하는 오버로드 partitioniongBy 메서드
    
    ```java
    // 채식 요리와 채식이 아닌 요리 각각의 그룹에서 가장 칼로리가 높은 요리 찾기
    Object mostCaloricPartitionedByVegetarian = menu.stream().collect(
        partitioningBy(Dish::isVegetarian,
            collectingAndThen(
                maxBy(comparingInt(Dish::getCalories)),
                Optional::get)));
    ```
    

### 6.4.2 숫자를 소수와 비소수로 분할하기

- 정수 n을 인수로 받아서 2에서 n까지의 자연수를 소수와 비소수로 나누는 코드
    
    ```java
    public static Map<Boolean, List<Integer>> partitionPrimes(int n) {
      return IntStream.rangeClosed(2, n).boxed()
          .collect(partitioningBy(candidate -> isPrime(candidate)));
    }
    
    public static boolean isPrime(int candidate) {
      return IntStream.rangeClosed(2, candidate-1)
          .limit((long) Math.floor(Math.sqrt(candidate)) - 1)
          .noneMatch(i -> candidate % i == 0);
    }
    ```
    

*(도서 223.p에 Collectors 클래스의 정적 팩토리 메서드 정리 표 있음)*

## 6.5 Collector 인터페이스

- Collector 인터페이스 : 리듀싱 연산(=컬렉터)을 어떻게 구현할지 제공하는 메서드 집합.

⇒ 앞으로 Collector 인터페이스를 직접 구현해서 **더 효율적**으로 문제를 해결하는 컬렉터를 만드는 방법을 볼 것.

- Collector 인터페이스의 시그니처와 다섯 개 매서드 정의
    
    ```java
    public interface Collector<T, A, R> {
      Supplier<A> supplier();
      BiConsumer<A, T> accumulator();
      BinaryOperator<A> combiner();
      Function<A, R> finisher();
      Set<Characteristics> characteristics();
    }
    ```
    

### 6.5.1 Collector 인터페이스의 메서드 살펴보기

> **supplier**
> 
- 새로운 결과 컨테이너 만들기
- 빈 결과로 이루어진 Supplier를 반환함.
- 수집 과정에서 빈 누적자 인스턴스를 만드는 파라미터가 없는 함수.

```java
public Supplier<List<T>> supplier() {
  return () -> new ArrayList<T>();
}
```

> **accumulator**
> 
- 결과 컨테이너에 요소 추가하기
- 리듀싱 연산을 수행하는 함수를 반환함.
- EX) 리스트에 현재 항목을 추가하는 연산

```java
public BiConsumer<List<T>, T> accumulator() {
  return (list, item) -> list.add(item);
}
```

> **finisher**
> 
- 최종 변환값을 결과 컨테이너로 적용하기
- 누적 과정을 끝낼 때 호출할 함수를 반환.

```java
public Function<List<T>, List<T>> finisher() {
  return i -> i;
}
```

*(도서 227.p 슌차 리듀싱 과정 논리적 순서 그림 참고하면 동작 과정을 이해하기 편함!)*

> combiner
> 
- 두 결과 컨테이너 병합
- 리듀싱 연산에서 사용할 함수를 반환한다.
- 스트림의 서로 다른 서브파트를 / 병렬로 처리할 때 / 누적자가 이 결과를 어떻게 처리할지 정의한다.

```java
public BinaryOperator<List<T>> combiner() {
  return (list1, list2) -> {
    list1.addAll(list2);
    return list1;
  };
}
```

*(도서 228.p 병렬화 리듀싱 과정에서 combiner 활용 그림 참고!!)*

> Characteristics
> 
- 컬렉터의 연산을 정의한다.
- 스트림을 병렬로 리듀스할 것인지 / 그리고 병렬로 리듀스한다면 / 어떤 최적화를 선택해야 할지 / 힌트 제공
- 아래 세 항목을 포함하는 열거형이다.
    1. UMORDERED
    2. CONCURRENT
    3. IDENTITY_FINISH

### 6.5.2 응용하기

- 지금까지 배운 매서드 활용해서 ToListCollector 구현하기

```java
// 지금까지 배운 메서드를 활용하여 ToListCollector 구현
public class ToListCollector<T> implements Collector<T, List<T>, List<T>> {
  @Override
  public Supplier<List<T>> supplier() { return () -> new ArrayList<T>(); }
  
  @Override
  public BiConsumer<List<T>, T> accumulator() { return (list, item) -> list.add(item); }
  
  @Override
  public Function<List<T>, List<T>> finisher() { return i -> i; }
  
  @Override
  public BinaryOperator<List<T>> combiner() {
    return (list1, list2) -> {
      list1.addAll(list2);
      return list1;
    };
  }
  
  @Override
  public Set<Characteristics> characteristics() {
    return Collections.unmodifiableSet(EnumSet.of(IDENTITY_FINISH, CONCURRENT));
  }
}
```

### 6.5.3 컬렉터 구현을 만들지 않고도 커스텀 수집 수행하기

가능하나, 코드가 간결함과 별개로 가독성이 떨어진다.

따라서, 커스텀 컬렉터를 구현하는 편이 중복을 피하고 재사용성을 높이는데 도움이 된다.

## 6.6 커스텀 컬렉터를 구현해서 성능 개선하기

- 커스텀 컬렉터를 **사용하지 않고** n이하의 자연수를 소수와 비소수로 분류한 코드
    
    ```java
    public static boolean isPrime(int candidate) {
      return IntStream.rangeClosed(2, candidate-1)
          .limit((long) Math.floor(Math.sqrt(candidate)) - 1)
          .noneMatch(i -> candidate % i == 0);
    }
    
    public static Map<Boolean, List<Integer>> partitionPrimes(int n) {
      return IntStream.rangeClosed(2, n).boxed()
          .collect(partitioningBy(candidate -> isPrime(candidate)));
    }
    ```
    
- 커스텀 컬렉터로 n까지의 자연수를 소수와 비소수로 분할한 코드
    
    ```java
    public static class PrimeNumbersCollector
        implements Collector<Integer, List<Integer Map<Boolean,>>, Map<Boolean, List<Integer>>> {
    
      @Override
      public Supplier<Map<Boolean, List<Integer>>> supplier() {
        return () -> new HashMap<>() {{
          put(true, new ArrayList<Integer>());
          put(false, new ArrayList<Integer>());
        }};
      }
    
      @Override
      public BiConsumer<Map<Boolean, List<Integer>>, Integer> accumulator() {
        return (Map<Boolean, List<Integer>> acc, Integer candidate) -> {
          acc.get(isPrime(acc.get(true), candidate)).add(candidate);
        };
      }
    
      @Override
      public BinaryOperator<Map<Boolean, List<Integer>>> combiner() {
        return (Map<Boolean, List<Integer>> map1, Map<Boolean, List<Integer>> map2) -> {
          map1.get(true).addAll(map2.get(true));
          map1.get(false).addAll(map2.get(false));
          return map1;
        };
      }
    
      @Override
      public Function<Map<Boolean, List<Integer>>, Map<Boolean, List<Integer>>> finisher() {
        return i -> i;
      }
    
      @Override
      public Set<Characteristics> characteristics() {
        return Collections.unmodifiableSet(EnumSet.of(IDENTITY_FINISH));
      }
    }
    ```
    

### 6.6.1 컬렉터 성능 비교

partitioningBy 코드 VS 커스텀 컬렉터

- 하니스 : 성능을 확인할 수 있는 코드

```java
// 컬렉터 성능 확인용 하니스
public class CollectorHarness {
  public static void main(String[] args) {
    System.out.println("Partitioning done in: " + execute(PartitionPrimeNumbers::partitionPrimesWithCustomCollector) + " msecs");
  }

  private static long execute(Consumer<Integer> primePartitioner) {
    long fastest = Long.MAX_VALUE;
    for (int i = 0; i < 10; i++) {
      long start = System.nanoTime();
      primePartitioner.accept(1_000_000);
      long duration = (System.nanoTime() - start) / 1_000_000;
      if (duration < fastest) {
        fastest = duration;
      }
    }
    return fastest;
  }
}

// 출력 예시
// Partitioning done in: 32 msecs
```

→ 출력해 보면 성능이 향상됨을 알 수 있다.