// 컴파일 오류와 런타임 오류 구분하기
// 기록: notes/02-compile-vs-runtime.md

function introduceStudent(studentName: string, currentLevel: number) {
  return studentName + " 님은 현재 " + currentLevel + "레벨이에요.";
}

// 3번: "1" -> 1 로 고친 최종 코드 (타입 오류 없음)
console.log(introduceStudent("광수", 1));

// 1~2번 재현용: 아래 주석을 해제하고 `pnpm check` 를 실행하면 컴파일 오류가 나요.
// introduceStudent("광수", "1");

// 4번 비교용: 컴파일은 통과하지만 런타임에 실패하는 배열 예제
const memberNames = ["광수"];
try {
  console.log(memberNames[5].toUpperCase());
} catch (error) {
  console.log("런타임 오류:", (error as Error).message);
}

export {};
