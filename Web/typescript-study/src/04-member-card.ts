// 오류를 고쳐 회원 카드 만들기
// 기록: notes/04-member-card.md
//
// 원본 코드의 오류 두 개를 한 번에 하나씩 고친 최종 코드예요.
//   1) level: "1"  -> 1          (string 을 number 자리에 넣음)
//   2) isLeader 프로퍼티가 빠짐   -> isLeader: false 추가

type StudyMember = {
  name: string;
  level: number;
  isLeader: boolean;
};

const member: StudyMember = {
  name: "광수",
  level: 1,
  isLeader: false,
};

// 반환 타입은 적지 않았어요. return 이 문자열 연결이므로 string 으로 추론돼요.
function createMemberCard(studyMember: StudyMember) {
  return studyMember.name + " 님, " + studyMember.level + "레벨";
}

console.log(createMemberCard(member));

export {};
