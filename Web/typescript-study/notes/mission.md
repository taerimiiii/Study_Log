# 미션: 스터디 회원 관리 프로그램

## 필수 미션

- 코드: [src/mission-member-manager.ts](../src/mission-member-manager.ts)

### 1. 회원 타입과 데이터

```ts
type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string; // 선택 값
}
```

- `role`은 `"leader" | "member"` 리터럴 유니언으로 제한해서 오타를 막았어요.
- `githubId?`는 옵셔널 프로퍼티라서 있어도 되고 없어도 돼요.
- 회원 3명을 서로 다른 정보로 만들었어요.

| id | name | role | githubId |
| --- | --- | --- | --- |
| 1 | 광수 | leader | gwangsoo |
| 2 | 지수 | member | (없음) |
| 3 | 현우 | member | hyunwoo |

### 2. 안내 문구 만들기

- `findMemberById(id): StudyMember | undefined` — `find()`는 못 찾으면 `undefined`를 반환하므로 반환 타입에 `undefined`를 포함했어요.
- `createMemberMessage(id): string`
  - `if (!member)`로 `undefined`를 먼저 걸러 **존재하지 않는 회원**을 처리해요. 이 아래부터 `member`는 `StudyMember`로 좁혀져요.
  - `member.githubId ?? "등록되지 않음"`으로 **GitHub 아이디가 없는 회원**을 처리해요.

처리하지 않고 바로 쓰면 컴파일 타임에 막혀요.

```
error TS18048: 'm' is possibly 'undefined'.          // find() 결과를 바로 m.name 으로 사용
error TS2532: Object is possibly 'undefined'.        // githubId.toUpperCase() 를 바로 호출
```

### 3. ID `1`, `2`, `999` 실행 결과

| 입력 | 출력 | 어떤 경우? |
| --- | --- | --- |
| `1` | `[1] 광수 (리더) - GitHub: gwangsoo` | 모든 정보가 있는 회원 |
| `2` | `[2] 지수 (멤버) - GitHub: 등록되지 않음` | GitHub 아이디가 없는 회원 |
| `999` | `ID 999 회원을 찾을 수 없어요.` | 존재하지 않는 회원 |

세 경우 모두 오류 없이 문구가 나와요.

### 4. 검증 과정

| 명령 | 결과 |
| --- | --- |
| `pnpm exec tsc --noEmit` | 오류 없이 종료 |
| `pnpm exec tsc` | `dist/mission-member-manager.js` 생성 |
| `node dist/mission-member-manager.js` | 위 표의 3줄 출력 |

---

## 선택 미션 1: `type`과 `interface` 비교

- 코드: [src/mission-optional-type-vs-interface.ts](../src/mission-optional-type-vs-interface.ts)

`StudyMember`와 같은 모양을 `StudyMemberInterface`(interface)와 `StudyMemberType`(type)으로 각각 작성했어요.

**세 문장 정리**

1. 둘 다 객체의 모양(프로퍼티 이름과 타입, 옵셔널 `?`)을 똑같이 표현할 수 있고, 구조가 같아서 서로에게 그대로 대입돼요 (코드에서 양방향 대입이 오류 없이 통과해요).
2. `interface`는 같은 이름으로 다시 선언하면 하나로 합쳐지지만(`Mergeable`에 `name`과 `level`이 모두 생김), `type`은 같은 이름으로 다시 선언할 수 없어요.
3. `type`은 객체뿐 아니라 유니언 같은 타입에도 쓸 수 있고 `&`로 조합할 수 있어서(`StudyMemberType & { status }`) 표현 범위가 더 넓고, `interface`는 주로 객체의 모양에 쓰며 `extends`로 확장해요.

---

## 선택 미션 2: `||` 와 `??`

- 코드: [src/mission-optional-nullish.ts](../src/mission-optional-nullish.ts)

```ts
const studyHour: number | undefined = 0;
studyHour || 1; // 1
studyHour ?? 1; // 0
```

**왜 다를까?**

- `||`는 왼쪽이 **falsy**(`0`, `""`, `false`, `null`, `undefined`, `NaN` 등)이면 오른쪽을 써요. `0`은 falsy라서 `1`이 돼요.
- `??`는 왼쪽이 **`null` 또는 `undefined`일 때만** 오른쪽을 써요. `0`은 둘 다 아니라서 `0`이 유지돼요.
- 학습 시간 `0`은 "공부하지 않았다"는 유효한 값이므로 `??`가 알맞아요. 모든 falsy를 "값 없음"으로 보고 싶을 때만 `||`를 써요.

---

## 선택 미션 3: `formatMemberId(input: unknown)`

- 코드: [src/mission-optional-format-member-id.ts](../src/mission-optional-format-member-id.ts)

`unknown`은 `typeof`로 확인한 뒤에만 쓸 수 있어서, 분기 안에서 안전하게 좁혀져요.

| 입력 | 출력 | 분기 |
| --- | --- | --- |
| `1` | `MEMBER-1` | 유한한 숫자 |
| `" member-02 "` | `MEMBER-02` | 문자열 (앞뒤 공백 제거 후 대문자) |
| `""` | `회원 ID가 비어 있어요.` | 빈 문자열 |
| `NaN` | `회원 ID를 확인할 수 없어요.` | 숫자지만 유한하지 않음 |
| `null` | `회원 ID를 확인할 수 없어요.` | 그 밖의 값 |
| `{ id: 1 }` | `회원 ID를 확인할 수 없어요.` | 그 밖의 값 |

`typeof NaN`은 `"number"`라서 `Number.isFinite`로 한 번 더 걸렀어요.

---

## 전체 검증

`pnpm exec tsc --noEmit`은 모든 파일(기존 실습 포함)에서 오류 없이 통과했고, 위 네 파일을 컴파일해 `node`로 실행한 결과를 표에 적었어요.
