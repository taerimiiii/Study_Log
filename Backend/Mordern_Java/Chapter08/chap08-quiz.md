# [8장] 컬렉션 API 개선

Q1. List.of("A", "B", "C")로 만든 리스트에 대해 옳은 설명은?

A) add()로 요소를 추가할 수 있다
B) 불필요한 객체 할당 없이 작은 불변 리스트를 만들 수 있다
C) Arrays.asList()와 달리 요소 삭제는 가능하다
D) 10개를 초과하는 요소는 List.of로 만들 수 없다

정답: B


Q2. removeIf(Predicate)를 Iterator 없이 컬렉션에서 직접 쓰는 이유로 요약에서 강조한 점은?

A) Iterator를 쓰면 병렬 처리가 불가능하기 때문
B) Iterator의 반복 상태와 Collection 상태가 동기화되지 않아 수동 삭제 시 문제가 생기기 때문
C) removeIf는 Set에서만 동작하기 때문
D) Predicate가 null이면 자동으로 모든 요소를 제거하기 때문

정답: B

