// 오류 두 개 해결하기
// 기록: notes/09-strict-errors.md
//
// 원본 코드의 오류 두 개를 고친 최종 코드예요.
//   1) targetCount: "3"          -> 3        (string 을 number 자리에 넣음)
//   2) printGoal 이 string 을 약속했지만 return 이 없음 -> return goal.title

type WeeklyGoal = {
  title: string;
  targetCount: number;
};

const weeklyGoal: WeeklyGoal = {
  title: "TypeScript 예제 연습",
  targetCount: 3,
};

// 반환 타입을 string 으로 명시해 두면, return 을 빠뜨렸을 때 컴파일 타임에 잡아줘요.
function printGoal(goal: WeeklyGoal): string {
  console.log(goal.title);
  return goal.title;
}

printGoal(weeklyGoal);

export {};
