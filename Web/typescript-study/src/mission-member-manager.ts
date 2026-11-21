// 필수 미션: 스터디 회원 관리 프로그램 완성하기
// 기록: notes/mission.md

type MemberRole = "leader" | "member";

// 회원의 ID, 이름, 역할 + 선택 값인 GitHub 아이디
interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

// 서로 다른 정보를 가진 회원 세 명 (GitHub 아이디가 없는 회원 포함)
const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" },
  { id: 3, name: "현우", role: "member", githubId: "hyunwoo" },
];

// 회원이 없으면 find() 가 undefined 를 반환하므로 반환 타입에 undefined 가 포함돼요.
function findMemberById(id: number): StudyMember | undefined {
  return members.find((member) => member.id === id);
}

function createMemberMessage(id: number): string {
  const member = findMemberById(id);

  // 존재하지 않는 회원: undefined 를 좁혀서 처리
  if (!member) {
    return `ID ${id} 회원을 찾을 수 없어요.`;
  }

  const roleLabel = member.role === "leader" ? "리더" : "멤버";
  // GitHub 아이디가 없는 회원: ?? 로 기본 문구 사용
  const githubId = member.githubId ?? "등록되지 않음";

  return `[${id}] ${member.name} (${roleLabel}) - GitHub: ${githubId}`;
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));

export {};
