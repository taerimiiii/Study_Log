# 값의 종류와 추론 확인하기

- 코드: [src/03-primitives-inference.ts](../src/03-primitives-inference.ts)

## 2. 추론된 타입 기록

값만 넣고 타입 표기는 하지 않았어요.

| 변수 | 대입한 값 | 추론된 타입 |
| --- | --- | --- |
| `memberName` | `"광수"` | `string` |
| `currentWeek` | `1` | `number` |
| `isDone` | `false` | `boolean` |
| `skills` | `["TypeScript", "React", "Node.js"]` | `string[]` (직접 표기) |

`let`으로 선언하면 나중에 다른 값으로 바뀔 수 있어서 `"광수"`가 아니라 넓은 타입 `string`으로 추론돼요. (`const`라면 `"광수"` 리터럴 타입이 돼요.)

## 4. 배열에 숫자를 넣었을 때

```ts
skills.push(123);
```

```
error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
```

**이유:** `skills`는 `string[]`이라서 `push`가 받는 값도 `string`뿐이에요. 숫자 `123`은 `string`에 대입할 수 없어서 컴파일 타임에 막혀요.

## 5. 내용이 같은 객체 `===` 비교

| 비교 | 예상 | 실제 실행 결과 | 이유 |
| --- | --- | --- | --- |
| `firstMember === secondMember` | `false` | `false` | 내용은 같지만 따로 만든 서로 다른 객체 |
| `firstMember === sameMember` | `true` | `true` | `sameMember`가 `firstMember`와 같은 객체를 가리킴 |

원시 값은 값이 같으면 같다고 비교되지만, 객체는 **같은 객체(참조)를 가리킬 때만** 같다고 비교돼요.

## 추가 확인: `const`로 선언한 객체

본문 예제대로 `const studyMember = { name: "광수" }`에 프로퍼티를 바꾸는 것은 가능하고, 다른 객체를 다시 넣으면 오류가 나요.

```
error TS2588: Cannot assign to 'studyMember' because it is a constant.
```

`const`가 막는 것은 변수에 **다른 객체를 다시 대입하는 일**이고, 객체 내부 프로퍼티 변경은 막지 않아요.
