// 회원 역할에 따라 문구 바꾸기
// 기록: notes/05-member-role.md

// 1번: 리터럴 유니언 타입
type MemberRole = "leader" | "member";

// 2~3번: 역할을 받아 안내 문구 반환 (반환 타입은 직접 적지 않음)
function getRoleMessage(role: MemberRole) {
  if (role === "leader") {
    return "스터디를 이끌어요.";
  }

  return "스터디에 참여해요.";
}

console.log(getRoleMessage("leader"));
console.log(getRoleMessage("member"));

// 4번: 정하지 않은 역할을 전달하면 컴파일 오류 (주석 해제 후 `pnpm check` 로 확인)
// getRoleMessage("manager");

export {};
