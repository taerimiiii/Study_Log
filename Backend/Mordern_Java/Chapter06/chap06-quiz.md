# [6장] 스트림으로 데이터 수집

Q1. 500칼로리 초과 요리만 Dish.Type별로 묶을 때, 스트림 앞단에서 filter만 쓰면 FISH 키가 사라질 수 있다. 요약에서 이를 해결하기 위해 제시한 방법은?

A) groupingBy 전에 sorted()로 정렬한다
B) groupingBy(Dish::getType, filtering(프레디케이트, toList()))처럼 다운스트림 filtering 컬렉터를 사용한다
C) partitioningBy로 먼저 나눈 뒤 groupingBy를 적용한다
D) flatMapping으로 모든 요리를 하나의 리스트로 합친다

정답: B


Q2. Collector<T, A, R> 인터페이스에서, 스트림의 각 요소를 누적자(결과 컨테이너)에 더하는 역할을 하는 메서드 이름을 적으시오.

정답: accumulator

해설: supplier()는 빈 누적자 생성, accumulator()는 요소 추가, combiner()는 병렬 시 누적자 병합, finisher()는 최종 결과 변환, characteristics()는 컬렉터 특성 힌트를 제공