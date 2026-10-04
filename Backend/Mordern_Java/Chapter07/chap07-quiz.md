# [7장] 병렬 데이터 처리와 성능

## 스터디 퀴즈!

Q1. Stream.iterate(1L, i -> i + 1).limit(n).parallel().reduce(...) 형태의 병렬 스트림이 순차 버전보다 느려질 수 있는 주된 이유는?

A) parallel()이 내부적으로 단일 스레드만 사용하기 때문
B) iterate는 이전 결과에 의존해 청크로 분할하기 어렵고, 스레드 할당 오버헤드만 커지기 때문
C) reduce는 병렬 스트림에서 지원되지 않기 때문
D) limit이 호출되면 자동으로 순차 스트림으로 전환되기 때문

정답: B


Q2. 3. Spliterator와 관련해 요약과 일치하는 설명은?

A) trySplit()이 null을 반환하면 더 이상 분할할 수 없음을 의미한다
B) tryAdvance는 요소를 한 번에 전체 컬렉션에 bulk로 처리한다
C) Spliterator는 순차 스트림 전용이며 병렬 스트림에는 사용할 수 없다
D) estimateSize()는 반드시 정확한 요소 개수만 반환해야 한다

정답: A