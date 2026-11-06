# 컴파일 오류와 런타임 오류 구분하기

- 코드: [src/02-compile-vs-runtime.ts](../src/02-compile-vs-runtime.ts)

## 1. `pnpm exec tsc --noEmit` 결과 — 오류는 언제 발생했나?

`introduceStudent("광수", "1")` 상태에서 실행하면 아래 오류가 나와요.

```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

- **컴파일 타임**에 발생했어요. `tsc`가 코드를 검사하는 단계에서 잡았고, `node`로 실행하기 전이에요.
- `--noEmit`이라 JavaScript 파일은 만들어지지 않았어요.

## 2. 기대한 타입과 전달한 타입

| 구분 | 타입 | 오류 메시지에서 찾는 위치 |
| --- | --- | --- |
| 전달한 타입 (실제) | `string` | `Argument of type 'string'` |
| 기대한 타입 | `number` | `parameter of type 'number'` |

두 번째 인자 `"1"`이 문자열이라서, `currentLevel: number` 자리에 들어갈 수 없다는 뜻이에요.

## 3. `"1"` → `1` 로 바꾼 뒤

`pnpm exec tsc --noEmit`이 아무 출력 없이 끝나요. 타입 오류가 사라졌어요.
실행 결과: `광수 님은 현재 1레벨이에요.`

## 4. 앞의 배열 예제와 비교 (한 문장)

> `introduceStudent("광수", "1")`은 **타입이 맞지 않아 컴파일 타임에 막히는** 오류이고, `memberNames[5].toUpperCase()`는 **컴파일은 통과하지만 실제 값이 `undefined`라서 런타임에 터지는** 오류예요.

### 참고: 배열 예제 실행 결과

`tsc`는 오류 없이 통과하지만 `node`로 실행하면 아래 오류가 나요. (코드에서는 `try/catch`로 감싸서 메시지만 출력해요.)

```
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```

| 구분 | `introduceStudent("광수", "1")` | `memberNames[5].toUpperCase()` |
| --- | --- | --- |
| `tsc` 통과 여부 | 실패 | 통과 |
| 오류 발생 시점 | 컴파일 타임 | 런타임 |
| 원인 | 인자 타입 불일치 | 존재하지 않는 인덱스 접근 (값이 `undefined`) |
