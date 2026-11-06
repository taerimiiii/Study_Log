# createBox<T> 사용하기

- 코드: [src/08-generic-box.ts](../src/08-generic-box.ts)

## 3. 각 결과의 `value`에 추론된 타입

| 호출 | `value` 타입 | 비고 |
| --- | --- | --- |
| `createBox("광수")` | `string` | `T`가 `string`으로 추론 |
| `createBox(100)` | `number` | `T`가 `number`로 추론 |
| `createBox<StudyMember>({ name: "광수", level: 1 })` | `StudyMember` | `T`를 직접 지정 |

`createBox("광수")`의 `T`는 `"광수"` 리터럴이 아니라 `string`으로 넓혀져요. `T`가 반환값의 최상위가 아니라 `{ value }` 객체 안에 들어 있기 때문이에요.
(본문의 `keepValue(false)`처럼 `T`가 반환 타입 최상위에 있으면 `false` 리터럴이 그대로 유지돼요. 직접 확인한 결과 `keepValue(false)`는 `false` 타입이에요.)

## 4. 반환 타입을 적지 않아도 입력 타입이 이어질까?

이어져요. 반환 타입은 `{ value: T }`로 추론되고, 호출할 때 `T`가 정해지면 `value`의 타입도 함께 정해져요.

- `nameBox.value.toUpperCase()` → 가능 (`string`)
- `scoreBox.value.toFixed(1)` → 가능 (`number`)
- `memberBox.value.name` → 가능 (`StudyMember`)

타입이 유지된다는 증거로 아래처럼 쓰면 컴파일 오류가 나요.

```ts
scoreBox.value.toUpperCase();
```

```
error TS2339: Property 'toUpperCase' does not exist on type 'number'.
```

`any`로 만들었다면 이 실수를 잡지 못했을 거예요. 제네릭은 입력한 타입 정보를 잃지 않아요.
