// createBox<T> 사용하기
// 기록: notes/08-generic-box.md

// 1번: 값을 받아 { value } 객체로 반환. 반환 타입은 적지 않아도 { value: T } 로 추론돼요.
function createBox<T>(value: T) {
  return { value };
}

type StudyMember = {
  name: string;
  level: number;
};

// 2번: 문자열, 숫자, 회원 객체를 각각 전달
const nameBox = createBox("광수"); // 3번: nameBox.value 에 마우스를 올려 타입 확인
const scoreBox = createBox(100);
const memberBox = createBox<StudyMember>({ name: "광수", level: 1 });

console.log(nameBox.value);
console.log(scoreBox.value);
console.log(memberBox.value);

// 4번: 입력 타입이 결과로 이어지는지 확인 — 문자열 메서드는 nameBox 에서만 쓸 수 있어요.
console.log(nameBox.value.toUpperCase());
console.log(scoreBox.value.toFixed(1));
console.log(memberBox.value.name);

// 타입이 이어지고 있다는 증거: 주석을 해제하면 컴파일 오류가 나요.
// scoreBox.value.toUpperCase();

export {};
