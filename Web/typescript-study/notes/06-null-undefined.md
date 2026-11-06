# 값이 없는 경우와 기본값 비교하기

- 코드: [src/06-null-undefined.ts](../src/06-null-undefined.ts)

## 실행 결과와 해석

| 번호 | 내용 | 출력 | 해석 |
| --- | --- | --- | --- |
| 1 | 없는 이름(`"현우"`)을 `find()`로 검색 | `undefined` | 조건에 맞는 값이 없으면 `find()`는 `undefined`를 반환해요. 타입은 `StudyMember \| undefined`. |
| 2 | `StudyMember \| null` 변수에 `null` 대입 | `null` | 개발자가 "지금은 비어 있다"고 의도적으로 표시한 상태예요. |
| 3 | `if (foundMember)`로 이름 출력 | `회원을 찾지 못했어요.` | `foundMember`가 `undefined`(falsy)라서 `else` 분기가 실행돼요. |
| 4-1 | `studyHour(0) \|\| 1` | `1` | `\|\|`는 `0` 같은 falsy 값이면 모두 기본값으로 바꿔요. |
| 4-2 | `studyHour(0) ?? 1` | `0` | `??`는 `null`/`undefined`일 때만 기본값을 써서 `0`이 유지돼요. |
| 5 | `foundMember?.githubId ?? "등록되지 않음"` | `등록되지 않음` | `?.`로 오류 없이 `undefined`가 되고, `??`가 기본 문구로 바꿔요. |

## `||` vs `??` 비교

| 왼쪽 값 | `\|\|` 기본값 | `??` 기본값 |
| --- | --- | --- |
| `0` | 기본값 사용 | `0` 유지 |
| `""` (빈 문자열) | 기본값 사용 | `""` 유지 |
| `null` / `undefined` | 기본값 사용 | 기본값 사용 |

`0`이나 빈 문자열이 **유효한 값**이면 `??`를 써야 해요.

## 참고

- 2번 코드에서 `null as StudyMember | null`로 쓴 이유: `const x: T | null = null`로만 쓰면 TypeScript가 흐름 분석으로 `x`를 `null` 타입으로 좁혀 버려서, 변수의 타입이 `StudyMember | null`이라는 점을 보여 주기 어려워요.
