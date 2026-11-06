// 값의 종류와 추론 확인하기
// 기록: notes/03-primitives-inference.md

// 1~2번: 값만 넣고 타입은 추론에 맡겨요. (변수에 마우스를 올리면 타입이 보여요)
let memberName = "광수"; // string
let currentWeek = 1; // number
let isDone = false; // boolean

console.log(memberName, currentWeek, isDone);

// 3번: 이번 달에 배울 기술 배열
const skills: string[] = ["TypeScript", "React", "Node.js"];
skills.push("pnpm");

// 4번: 숫자를 넣으면 컴파일 오류 (주석 해제 후 `pnpm check` 로 확인)
// skills.push(123);

console.log(skills);

// 5번: 내용이 같은 객체 두 개를 === 로 비교
const firstMember = { name: "광수" };
const secondMember = { name: "광수" };
const sameMember = firstMember;

console.log(firstMember === secondMember); // 예상: false (서로 다른 객체)
console.log(firstMember === sameMember); // 예상: true (같은 객체를 가리킴)

export {};
