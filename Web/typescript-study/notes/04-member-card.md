# 오류를 고쳐 회원 카드 만들기

- 코드: [src/04-member-card.ts](../src/04-member-card.ts)

## 고치는 순서

### 1~2. `level` 확인하고 먼저 고치기

원본의 `level: "1"`은 `StudyMember.level: number`와 맞지 않아요.

```
error TS2322: Type 'string' is not assignable to type 'number'.
```

→ `level: 1`로 수정하고 타입 검사를 다시 실행했어요.

### 3. 새로 나타난 오류 → 빠진 프로퍼티 추가

```
error TS2741: Property 'isLeader' is missing in type '{ name: string; level: number; }' but required in type 'StudyMember'.
```

`StudyMember`는 `isLeader: boolean`을 필수로 요구하는데 객체에 없었어요.
→ `isLeader: false`를 추가했어요.

> 처음에는 `level` 오류만 보이고, 그것을 고치고 나서야 `isLeader` 오류가 나타났어요. 오류를 한 번에 하나씩 고치라는 안내가 이래서 나온 거예요.

### 4. 함수 실행과 반환 타입

실행 결과: `광수 님, 1레벨`

`createMemberCard`의 반환 타입은 적지 않았고, `return`이 문자열 연결(`string + ... + string`)이라 **`string`으로 추론**돼요.

## 정리

| 오류 | 원인 | 수정 |
| --- | --- | --- |
| `Type 'string' is not assignable to type 'number'` | `level`에 문자열을 넣음 | `"1"` → `1` |
| `Property 'isLeader' is missing` | 필수 프로퍼티 누락 | `isLeader: false` 추가 |
