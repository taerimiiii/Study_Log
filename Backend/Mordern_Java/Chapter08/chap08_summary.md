# [8장] 컬렉션 API 개선

<aside>

8장에서는 새로운 컬렉션 API 기능을 배운다!

1. 컬렉션 팩토리 - 작은 리스트, 집합, 맵 쉽게 만들기
2. 리스트와 집합에서 요소를 삭제하거나 바꾸는 관용 패턴 적용 방법
3. 맵 작업과 관련해 추가된 새로운 편리 기능 
</aside>

## 8.1 컬렉션 팩토리

> **~~Arrays.asList()~~** 팩토리 메서드
> 
> 
> ```java
> List<String> friends = Arrarys.asList("Raphael", "Olivaia", "Thibaut");
> ```
> 
> - 요소 추가 X, 삭제 X
> - → 시도 시, UnsupportedOperationExecption 예외 발생

> **~~HashSet~~**
> 
> 
> ```java
> Set<String> friends = Stream.of("Raphael", "Olivaia", "Thibaut")
> 														.collect(Collectors.toSet());
> ```
> 
> - 집합(중복X)

⇒ 둘 다 내부적으로 불필요한 객체 할당이 이루어짐 (문제점)

### 8.1.1 리스트 팩토리

> **List.of**
> 
> 
> ```java
> List<String> friends = List.of("Raphael", "Olivaia", "Thibaut");
> ```
> 
> - 마찬가지로 가변이 아니기 때문에 요소 추가는 안 됨.
> - 객체 할당이 이루어지지 않음?

Q. 컬렉션 팩토리 VS 스트림 API

A. Collectors.toList() 컬렉터로 스트림→리스트 변환 가능하다.
    즉, 데이터 처리 형식을 설정하거나 데이터를 변환할 필요가 없다면, 사용하기 간편한 팩토리 메서드를 이용할 것을 권장함.

### 8.1.2 집합 팩토리

> **Set.of**
> 
> 
> ```java
> Set<String> friends = Set.of("Raphael", "Olivaia", "Thibaut");
> ```
> 

### 8.1.3 맵 팩토리

- 키와 값이 필수

> **Map.of**
> 
> 
> ```java
> Map<String, Integer> ageOfFriends = Map.of("Raphael", 30, "Olivaia", 25, "Thibaut", 26);
> ```
> 
> - 10개 이하인 쌍을 가진 경우 유용
> - 그 이상부터는 가변으로 구현

> **Map.ofEntries**
> 
> 
> ```java
> Map<String, Integer> ageOfFriends2 = Map.ofEntries(
>         entry("Raphael", 30),
>         entry("Olivia", 25),
>         entry("Thibaut", 26));
> ```
> 
> - Map.Entry<K, V> 객체를 인수로 받음
> - 가변 인수로 구현된 Map.ofEntries 메서드 이용함.
> - Map.entry 는 Map.Entry 객체를 만드는 메서드

## 8.2 리스트와 집합 처리

### 8.2.1 removeIf 메서드

→ 프레디케이트를 만족하는 요소를 제거함

```java
// 숫자로 시작되는 참조 코드를 가진 트랜잭션을 삭제하는 코드
transactions.removeIf(transaction -> 
								Character.isDigit(transaction.getReferenceCode().charAt(0)));
```

Q. removeIf 를 사용하지 않으면 왜 안 되나용?

A. Iterator 객체의 반복자 상태와 Collection 객체 상태와 서로 동기화 되지 않아 문제가 발생합니당!

### 8.2.2 replace 메서드

→ 리스트에서 이용할 수 있는 기능으로 UnaryOperator 함수를 이용해 요소를 변경함.

```java
referenceCodes.replaceAll(code -> 
									Character.toUpperCase(code.charAt(0)) + code.substring(1));
```

- ListIterator 객체를 사용하는 것 보다 코드가 간결함.

## 8.3 맵 처리

### 8.3.1 forEach 메서드

- 맵에서 키와 값을 확인을 반복함

```java
ageOfFriends.forEach((friend, age) 
											-> System.out.println(friend + " is " + age + " years old"));
```

### 8.3.2 정렬 메서드

- Entry.comparingByValue : 값을 기준으로 정렬
- Entry.comparingByKey : 키를 기준으로 정렬

Q. 요청한 키가 맵에 존재하지 않을 때는 어떡하나요?

A. getOrDefault 메서드를 이용하자!

### 8.3.3 getOrDefault 메서드

→ 첫 번째 인수로 키를, 두 번째 인수로 기본값을 받는다.

```java
System.out.println(favouriteMovies.getOrDefault("Olivia", "Matrix"));
System.out.println(favouriteMovies.getOrDefault("Thibaut", "Matrix"));
```

### 8.3.4 계산 패턴

> **computeIfAbsent**
> 
> - 제공된 키에 해당하는 값이 없으면 / 키를 이용해 새로운 값을 계산하고 / 맵에 추가함
> 
> ```java
> friendsToMovies.computeIfAbsent("Raphael", name -> new ArrayList<>())
>     .add("Star Wars");
> ```
> 

> **computeIfPresent**
> 
> - 제공된 키가 존재하면 /  새 값을 계산하고 / 맵에 추가
> 
> ```java
> favouriteMovies.computeIfPresent("Raphael", (friend, movie) 
> 																							-> movie.toUpperCase());
> ```
> 

### 8.3.5 삭제 패턴

- 매핑을 제거할 때는 **remove 메서드 오버라이드한 것**을 이용

```java
favouriteMovies.remove(key, value);
```

### 8.3.6 교체 패턴

- replaceAll : 각 항목의 값을 교체
- Replace : 키가 존재하면, 맵의 값을 바꿈

### 8.3.7 합침

> **putAll**
> 
> - 2개의 맵을 합칠 때 사용
> - 중복된 키가 없다면 잘 동작함.
> 
> ```java
> Map<String, String> everyone = new HashMap<>(family);
> everyone.putAll(friends);
> ```
> 

> **merge**
> 
> - putAll 보다 유연하게 합치고 싶을 사용.
> - 중복된 키를 어떻게 합칠지 결정 가능
> 
> ```java
> // forEach 사용.
> Map<String, String> everyone2 = new HashMap<>(family);
> friends2.forEach((k, v) -> everyone2.merge(k, v, (movie1, movie2) 
> 																										-> movie1 + " & " + movie2));
> ```
> 

## 8.4 개선된 ConcurrentHashMap

- **ConcurrentHashMap** : 동시 추가, 갱신 작업 허용

→ 연산 성능이 향상됨.

### 8.4.1 리듀스와 검색

[ConcurrentHashMap  지원 연산]

- forEach : 각 (키, 값) 쌍에 주어진 액션을 실행
- reduce : 모든 (키, 값) 쌍을 제공된 리듀스 함수를 이용해 결과로 합침
- search : 널이 아닌 값을 반환할 때까지 각 (키, 값) 쌍에 함수를 적용

⇒ 모두 상태를 잠그지 않고 연산을 수행함.

- 병렬성 기준값
    - 1로 지정하면 공통 스레드 풀을 이용해 병렬성을 극대화함.
    - 어지간하면 기준값을 따르는게 좋음.
    - 박싱 작업이 필요 없어서 효율적임

### 8.4.2 계수

- mappingCount : 맵의 매핑 개수를 반환함

### 8.4.3 집합뷰

- KeySet : ConcurrentHashMap→집합뷰 변환 메서드