# 회원 역할에 따라 문구 바꾸기

- 코드: [src/05-member-role.ts](../src/05-member-role.ts)

## 작성한 내용

```ts
type MemberRole = "leader" | "member";

function getRoleMessage(role: MemberRole) {
  if (role === "leader") {
    return "스터디를 이끌어요.";
  }
  return "스터디에 참여해요.";
}
```

실행 결과:

```
스터디를 이끌어요.
스터디에 참여해요.
```

## 4. 정하지 않은 역할을 전달했을 때

```ts
getRoleMessage("manager");
```

```
error TS2345: Argument of type '"manager"' is not assignable to parameter of type 'MemberRole'.
```

`"manager"`는 `"leader" | "member"` 둘 중 어느 쪽도 아니라서 컴파일 타임에 막혀요. 오타나 정해지지 않은 값을 실행 전에 걸러 줘요.

## 확인한 점

- `if (role === "leader")` 이후 코드에서는 `role`이 `"member"`로 좁혀져요 (타입 좁히기).
- 반환 타입을 적지 않았을 때 추론 결과는 `string`이 아니라 **`"스터디를 이끌어요." | "스터디에 참여해요."`** (문자열 리터럴 유니언)이에요.
