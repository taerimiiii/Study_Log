# [7장] 병렬 데이터 처리와 성능

💡 노션에서 더 가독성 좋게 확인 가능합니다! *([🔗노션 페이지에서 보기](https://hyper-noise-b36.notion.site/7-3dec2d48bf0080c38d51cb406feb6a44))*

<aside>

7장에서는 스트림으로 데이터 컬렉션 관련 동작을 얼마나 쉽게 병렬로 실행 할 수 있는지 알아본다.

⇒ 요약: **병렬**이 핵심!!

</aside>

## 7.1 병렬 스트림

지난 4장에서*~~(기억이 가물가물하지만)~~* 스트림 인터페이스를 이용하면 간단히 병렬 처리가 가능하다고 언급했다.

- parallelStream : 호출하면 병렬 스트림이 생성된다.
- 병렬 스트림 : 각각의 스레드에서 처리할 수 있도록 / 스트림 요소를 여러 청크로 분할한 스트림.

```java
// 1부터 n까지 모든 숫자의 합계를 반환하는 코드 추가.
// reduce 연산 쓴 버전과, 전통적인 버전(초기화 및 for문) 각각
public static long iterativeSum(long n) {
    long result = 0;
    for (long i = 0; i <= n; i++) {
      result += i;
    }
    return result;
  }

  public static long sequentialSum(long n) {
    return Stream.iterate(1L, i -> i + 1).limit(n).reduce(Long::sum).get();
  }
```

### 7.1.1 순차 스트림을 병렬 스트림으로 변환하기

Q. 순차 스트림 → 병렬 스트림 변환 어떻게 하나요??

A. **parallel** 매서드를 호출하면 됩니당!

```java
// 위 숫자 합계 계산 코드에서 리듀싱 연산 병렬 처리 추가.
public static long parallelSum(long n) {
    return Stream.iterate(1L, i -> i + 1).limit(n).parallel().reduce(Long::sum).get();
  }
```

Q. 그럼 병렬 스트림 → 순차 스트림 은 어떻게 하나용??

A. **sequential** 메서드를 호출하면 됩니다!!

Q. 그럼 parallel 매서드랑 sequential 매서드 둘 다 쓰면 어떻게 되나용??

A. 나중에 호출된 매서드가 전체 파이프라인에 영향을 끼칩니당!!

### 7.1.2 스트림 성능 측정

Q. 그럼 병렬화를 하면 성능이 무조건 좋아 지는 건가요?

A. 아니요? 무슨소리세요?? 5장에서 병렬에는 대가가 따른다고 설명했자나요!!! (174.p)

Q. 이잉 그럼 언제 병렬화를 해야 하나요?

A. 무조건 절대 꼭 반드시 **성능 측정**해서 정하면 됩니다!

Q. 성능 측정은 어떻게 하나요?

A. 자바 마이크로벤치마크 하니스(JMH) 라이브러리를 이용해 벤치마크를 구현해 확인합니다.

```java
// n개의 숫자를 더하는 함수의 성능 측정 코드
@State(Scope.Thread)
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@Fork(value = 2, jvmArgs = { "-Xms4G", "-Xmx4G" })
@Measurement(iterations = 2)
@Warmup(iterations = 3)
public class ParallelStreamBenchmark {

  private static final long N = 10_000_000L;

  @Benchmark
  public long iterativeSum() {
    long result = 0;
    for (long i = 1L; i <= N; i++) {
      result += i;
    }
    return result;
  }

  @Benchmark
  public long sequentialSum() {
    return Stream.iterate(1L, i -> i + 1).limit(N).reduce(0L, Long::sum);
  }

  @Benchmark
  public long parallelSum() {
    return Stream.iterate(1L, i -> i + 1).limit(N).parallel().reduce(0L, Long::sum);
  }

  @Benchmark
  public long rangedSum() {
    return LongStream.rangeClosed(1, N).reduce(0L, Long::sum);
  }

  @Benchmark
  public long parallelRangedSum() {
    return LongStream.rangeClosed(1, N).parallel().reduce(0L, Long::sum);
  }

  @TearDown(Level.Invocation)
  public void tearDown() {
    System.gc();
  }

}
```

실제로 성능을 측정해 보면,
        병렬 버전이 쿼드 코어 CPU를 활용하지 못하고
                순차 버전에 비해 다섯 배나 **느린** 결과가 나옴을 볼 수 있따..
        왜?! ;ㅁ;
                이전 연산의 결과에 따라 다음 함수의 입력이 달라지기 떄문에,
                iterate 연산을 청크로 **분할하기 어렵기 때문**이다.
                        이는 곧 스레드를 할당하는 **오버헤드**만 **증가**시키며,
                                **성능을 떨어뜨린다**.

다음과 같이 병렬 스트림을 적용하면 순차 실행보다 빠른 성능을 갖는 병렬 리듀싱을 만들 수 있다.

```java
// 순차 보다 빠른 실행을 갖는 병렬 코드
public static long parallelRangedSum(long n) {
    return LongStream.rangeClosed(1, n).parallel().reduce(Long::sum).getAsLong();
  }
```

⇒ 올바른 자료구조를 선택해야, 병렬 실행도 최적의 성능을 발휘할 수 있다는 사실을 알 수 있다.

### 7.1.3 병렬 스트림의 올바른 사용법

- 가장 많이 병렬 스트림을 잘못 사용하는 사례 = 공유된 상태를 바꾸는 알고리즘을 사용하는 것.

```java
// n까지 자연수를 더하면서 공유된 누적자를 바꾸는 코드
// 명령어 프로그래밍으로 구현됨.
public static long sideEffectSum(long n) {
    Accumulator accumulator = new Accumulator();
    LongStream.rangeClosed(1, n).forEach(accumulator::add);
    return accumulator.total;
  }

  public static class Accumulator {

    private long total = 0;

    public void add(long value) {
      total += value;
    }

  }
```

Q. 이것을 병렬로 접근하면 어떻게 될까?

A. 본질적으로 순차 실행으로 구현되어 있어, 
          병렬로 실행하면 total을 접근할 때마다 
                  다수의 스레드에서 동시에 데이터에 접근하는 문제가 발생한다.

실제로 스트림을 병렬로 만들어서 어떤 문제가 일어나는지 실행해 보면, 결과값조차 바르게 나오지 않음을 확인 할 수 있다.

⇒ 병렬에서는 공유된 **가변 상태**를 반드시 피해야 한다.

*(p. 174에서도 언급됨!)*

### 7.1.4 병렬 스트림 효과적으로 사용하기

- 양을 기준으로 병렬 스트림 사용을 결정하는 것은 적절하지 않다.
- EX) 천 개 이상의 요소가 있을 때만 병렬 스트림을 사용하라 → 절대 노노

어떤 상황에서 병렬 스트림을 사용할 것인지 판단할 기준은 다음과 같다:

1. 확신이 서지 않다면 **직접 측정**하자! 순차와 병렬 중 무엇이 좋을지 모르겠다면 적절한 벤치 마크로 직접 성능을 측정해 보자.
2. **박싱**을 **주의**하자! 기본형 특화 스트림을 박싱 동작을 피할 수 있도록 제공되므로, 되도록이면 기본형 특화 스트림을 사용하는 것이 좋다.
3. 순차보다 병렬에서 성능이 떨어지는 연산이 있다. 특: limit, findFirst
4. **전체 파이프라인 연산 비용**을 고려하자!
처리할 요소 수가 N이고 하나의 요소를 처리하는데 드는 비용을 Q라 가정했을 때,
전체 파이프라인 비용은 N*Q 이다.
즉, Q가 높다 = 병렬 스트림 성능 개선 가능!! 이다.
5. **소량**의 **데이터**에는 병렬이 도움이 되지 않는다.
6. 자료구조를 확인하자! EX) 병렬은 ArraryList 보다 LinkedList에 효율적이다.
7. 병렬 스트림이 수행되는 **내부 인프라구조**를 살펴보자! → **포크/조인 프레임워크**

## 7.2 포크/조인 프레임워크

병렬화할 수 있는 작업을
       재귀적으로 작은 작업으로 분할한 다음에
              서브테스크 각각의 결과를 합쳐서
                     전체 결과를 만들도록 설계됨.

- ExecutorService 인터페이스 : 서브테스크를 스레드 풀의 작업자 스레드에 분산 할당

### 7.2.1 Recursive Task 활용

스레드 풀을 이용하려면 → RecursiveTask<R>의 서브클래스를 만들어야 함.
→ RecursiveTask를 정의하려면 → 추상 메서드 compute를 구현해야 함.

- compute 메서드
    
    태스크를 서브태스크로 분할하는 로직과
          더 이상 분할할 수 없을 때
                개별 서브태스크의 결과를 생산할 알고리즘을 정의한다.
    
    <aside>
    
    if (태스크가 충분히 작거나 더 이상 분할할 수 없으면) {
          순차적으로 태스크 계산
    } else {
          태스크를 두 서브태스크로 분할
          태스크가 다시 서브태스크로 분할되도록 이 메서드를 재귀적으로 호출함
          모든 서브태스크의 연산이 완료될 때 까지 기다림
          각 서브테스크의 결과를 합침
    }
    
    </aside>
    
    ⇒ 분할정복 알고리즘의 **병렬화 버전**
    

```java
// 범위의 숫자를 더하는 문제 예제
public class ForkJoinSumCalculator extends RecursiveTask<Long> {

  public static final long THRESHOLD = 10_000;

  private final long[] numbers;
  private final int start;
  private final int end;

  public ForkJoinSumCalculator(long[] numbers) {
    this(numbers, 0, numbers.length);
  }

  private ForkJoinSumCalculator(long[] numbers, int start, int end) {
    this.numbers = numbers;
    this.start = start;
    this.end = end;
  }

  @Override
  protected Long compute() {
    int length = end - start;
    if (length <= THRESHOLD) {
      return computeSequentially();
    }
    ForkJoinSumCalculator leftTask = new ForkJoinSumCalculator(numbers, start, start + length / 2);
    leftTask.fork();
    ForkJoinSumCalculator rightTask = new ForkJoinSumCalculator(numbers, start + length / 2, end);
    Long rightResult = rightTask.compute();
    Long leftResult = leftTask.join();
    return leftResult + rightResult;
  }

  private long computeSequentially() {
    long sum = 0;
    for (int i = start; i < end; i++) {
      sum += numbers[i];
    }
    return sum;
  }

  public static long forkJoinSum(long n) {
    long[] numbers = LongStream.rangeClosed(1, n).toArray();
    ForkJoinTask<Long> task = new ForkJoinSumCalculator(numbers);
    return FORK_JOIN_POOL.invoke(task);
  }

}
```

각 서브테스크는 순차적으로 처리되며
      포킹 프로세스로 만들어진 이진트리의 태스크를 루트에서 역순으로 방문함.
            → 서브태스크의 부분 결과를 합쳐서 태스크의 최종 결과를 계산함.

*(이해가 어렵다면 도서의 259.p 그림 7-4 확인하기!)*

### 7.2.2 포크/조인 프레임워크를 제대로 사용하는 방법

1. 두 서브태스크가 모두 시작된 다음에 join을 호출해야 한다!
Be: 각각의 서브태스크가 다른 태스크가 끝나길 기다리기 때문.
       즉, join 메서드를 테스크에 호출하면,
       태스크가 생산하는 결과가 준비될 때까지 호출자를 블록함.
2. RecursiveTask 내에서는 ForkJoinPool의 invoke 메서드 사용 X
3. 서브태스크에 fork 메서드를 호출해서 ForkJoinPool의 일정 조절 가능
4. 포크/조인 프레임워크 병렬 계산은 디버깅 어려움
5. 무조건 빠를 거라는 생각 XX!

⇒ 주어진 **서브테스크를 더 분할**할 것인지 기준을 정해야 함.

### 7.2.3 작업 훔치기

- ForkJoinSumCalculator 예제에서는 덧셈을 수행할 숫자가 만 개 이하면 서브태스크 분할을 중단했음.
- 실제로는 코어 개수와 관계 없이, 적절한 크기로 분할된 많은 태스크를 포킹하는 것이 바람직함.
- 왜? 뭔 일이 터질지 모르기 때문임.

> **작업 훔치기
→** 포크/조인 프레임워크가 위 문제를 해결하는 기법.
> 
> 1. ForkJoin의 모든 스레드를 공정하게 분할함.
> 2. 각각의 스레드는 할당 작업이 끝나면 큐의 헤드에서 다른 태스크를 가져와서 작업을 처리
> 3. 할 일이 없어지면 다른 스레드 큐의 꼬리에서 작업을 훔쳐옴.

## 7.3 Spliterator 인터페이스

> **Spliterator**
> 
> - 분할 할 수 있는 반복자
> - 자동으로 스트림을 분할함
> - 병렬 작업 특화

```java
// Spliterator 인터페이스 정의
public interface Spliterator<T> {
    boolean tryAdvance(Consumer<? super T> action);
    Spliterator<T> trySplit();
    long estimateSize();
    int characteristics();
}
```

- tyrAdvance : Spliterator 요소를 하나씩 순차적으로 탐색. =일반적인 Iterator 동작과 같음.
- trySplit : Spliterator 일부 요소를 분할해서 두 번째 Spliterator 생성
- estimateSize : 요소 수 정보 제공

### 7.3.1 분할 과정

- trySplit이 null을 반환한다면 더 이상 자료구조를 분할할 수 없음을 의미.
- Spliterator는 characteristices 추상 메서드도 정의함.

### 7.3.2 커스텀 Spliterator 구현하기

- 반복형
    
    ```java
    // 문자열의 단어 수를 계산하는 단순한 메서드 구현 코드
    public static int countWordsIteratively(String s) {
    int counter = 0;
    boolean lastSpace = true;
    for (char c : s.toCharArray()) {
      if (Character.isWhitespace(c)) {
        lastSpace = true;
      }
      else {
        if (lastSpace) {
          counter++;
        }
        lastSpace = Character.isWhitespace(c);
      }
    }
    return counter;
    }
    ```
    
- 함수형
    
    ```java
    // 문자열의 단어 수를 계산하는 단순한 메서드 구현 코드
    private static int countWords(Stream<Character> stream) {
    WordCounter wordCounter = stream.reduce(new WordCounter(0, true), WordCounter::accumulate, WordCounter::combine);
    return wordCounter.getCounter();
    }
    
    private static class WordCounter {
    
    private final int counter;
    private final boolean lastSpace;
    
    public WordCounter(int counter, boolean lastSpace) {
      this.counter = counter;
      this.lastSpace = lastSpace;
    }
    
    public WordCounter accumulate(Character c) {
      if (Character.isWhitespace(c)) {
        return lastSpace ? this : new WordCounter(counter, true);
      }
      else {
        return lastSpace ? new WordCounter(counter + 1, false) : this;
      }
    }
    
    public WordCounter combine(WordCounter wordCounter) {
      return new WordCounter(counter + wordCounter.counter, wordCounter.lastSpace);
    }
    
    public int getCounter() {
      return counter;
    }
    
    }
    ```
    
- WordCounter 병렬로 수행하기
    
    ```java
    // 문자열의 단어 수를 계산하는 단순한 메서드 구현 코드
    // Spliterator 활용.
    public static int countWords(String s) {
    Spliterator<Character> spliterator = new WordCounterSpliterator(s);
    Stream<Character> stream = StreamSupport.stream(spliterator, true);
    
    return countWords(stream);
    }
    
    private static class WordCounterSpliterator implements Spliterator<Character> {
    
    private final String string;
    private int currentChar = 0;
    
    private WordCounterSpliterator(String string) {
      this.string = string;
    }
    
    @Override
    public boolean tryAdvance(Consumer<? super Character> action) {
      action.accept(string.charAt(currentChar++));
      return currentChar < string.length();
    }
    
    @Override
    public Spliterator<Character> trySplit() {
      int currentSize = string.length() - currentChar;
      if (currentSize < 10) {
        return null;
      }
      for (int splitPos = currentSize / 2 + currentChar; splitPos < string.length(); splitPos++) {
        if (Character.isWhitespace(string.charAt(splitPos))) {
          Spliterator<Character> spliterator = new WordCounterSpliterator(string.substring(currentChar, splitPos));
          currentChar = splitPos;
          return spliterator;
        }
      }
      return null;
    }
    
    @Override
    public long estimateSize() {
      return string.length() - currentChar;
    }
    
    @Override
    public int characteristics() {
      return ORDERED + SIZED + SUBSIZED + NONNULL + IMMUTABLE;
    }
    
    }
    ```
    
    - tyrAdvance : 문자열에서 / 현재 인덱스에 해당하는 문자를 / Consumer에 제공한 다음에 / 인덱스를 증가시킴 *→ 새로운 커서 위치가 전체 문자열 길이보다 작으면 참을 반환하며 이는 반복 탐색해야 할 문자가 남아 있음을 의미.*
    - trySplit : 반복될 자료구조를 분할
    - estimateSize : 프레임워크에 Spliterator가 어떤 특성인지 열거형으로 알려줌.