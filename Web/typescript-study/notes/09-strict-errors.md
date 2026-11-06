# 오류 두 개 해결하기

- 코드: [src/09-strict-errors.ts](../src/09-strict-errors.ts)

## 1~2. 오류 위치, 기대한 타입과 실제 타입

원본 코드로 `pnpm exec tsc --noEmit`을 실행했을 때 나온 오류예요. (줄 번호는 이 연습 파일 기준이 아니라, 본문 코드를 그대로 붙여 넣었을 때의 번호예요.)

| # | 위치 | 오류 메시지 | 기대한 타입 | 실제 타입 |
| --- | --- | --- | --- | --- |
| 1 | `targetCount: "3"` (8번째 줄) | `TS2322: Type 'string' is not assignable to type 'number'.` | `number` | `string` |
| 2 | `function printGoal(...): string {` (11번째 줄) | `TS2355: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.` | `string` 반환 | 반환값 없음 (`void`처럼 동작) |

## 3. `targetCount` 고치기

`"3"` → `3` 으로 바꾸고 다시 검사하면 1번 오류가 사라져요.

## 4. `printGoal`이 문자열을 반환하도록 고치기

```ts
function printGoal(goal: WeeklyGoal): string {
  console.log(goal.title);
  return goal.title;
}
```

`pnpm exec tsc --noEmit`이 오류 없이 끝나요. 실행 결과: `TypeScript 예제 연습`

## 5. 이 예제에서 반환 타입을 명시한 이유

반환 타입을 `: string`으로 **명시해 두었기 때문에** `return`을 빠뜨린 실수를 컴파일 타임에 잡을 수 있었어요.

반환 타입을 적지 않고 같은 함수를 만들어 확인해 보니 **오류 없이 통과**했어요. 이때는 반환 타입이 `void`로 추론되어, `return`이 없는 것이 실수인지 의도인지 TypeScript가 알 수 없어요.

> 반환 타입 명시는 "이 함수는 문자열을 돌려줘야 한다"는 약속이에요. 약속을 어기면 오류를 내고, 읽는 사람에게도 의도가 문서처럼 전달돼요.
