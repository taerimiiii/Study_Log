// 값이 없는 경우와 기본값 비교하기
// 기록: notes/06-null-undefined.md

type StudyMember = {
  name: string;
  githubId?: string;
};

const members: StudyMember[] = [
  { name: "광수", githubId: "gwangsoo" },
  { name: "지수" },
];

// 1번: 없는 이름을 찾으면 undefined
const foundMember = members.find((member) => member.name === "현우");
console.log("1) foundMember:", foundMember); // undefined

// 2번: 의도적으로 비어 있는 상태는 null
const selectedMember: StudyMember | null = null as StudyMember | null;
console.log("2) selectedMember:", selectedMember); // null

// 3번: 회원이 있을 때만 이름 출력
if (foundMember) {
  console.log("3) 이름:", foundMember.name);
} else {
  console.log("3) 회원을 찾지 못했어요.");
}

// 4번: 학습 시간이 0일 때 || 와 ?? 비교
const studyHour: number | undefined = 0;
console.log("4) || :", studyHour || 1); // 1  (0 도 falsy 라서 기본값이 됨)
console.log("4) ?? :", studyHour ?? 1); // 0  (null/undefined 일 때만 기본값)

// 5번: ?. 와 ?? 로 GitHub 아이디 기본값 처리
const displayGithubId = foundMember?.githubId ?? "등록되지 않음";
console.log("5) githubId:", displayGithubId);

export {};
