// 선택 미션 1: StudyMember 를 type 으로도 작성하고 interface 와 비교하기
// 기록: notes/mission.md

type MemberRole = "leader" | "member";

// interface 버전
interface StudyMemberInterface {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

// type 버전 (같은 모양)
type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

// 서로 구조가 같아서 값을 주고받을 수 있어요.
const fromInterface: StudyMemberInterface = { id: 1, name: "광수", role: "leader" };
const fromType: StudyMemberType = fromInterface;
const backToInterface: StudyMemberInterface = fromType;
console.log(fromType, backToInterface);

// 차이 1: interface 는 같은 이름으로 다시 선언하면 하나로 합쳐져요.
interface Mergeable {
  name: string;
}
interface Mergeable {
  level: number;
}
const merged: Mergeable = { name: "광수", level: 1 };

// 차이 2: type 은 객체가 아닌 타입(유니언 등)에도 쓸 수 있고, & 로 조합해요.
type Status = "present" | "late" | "absent";
type WithStatus = StudyMemberType & { status: Status };
const withStatus: WithStatus = { ...fromType, status: "present" };

console.log(merged, withStatus);

export {};
