// unknown 값 구분하기
// 기록: notes/07-unknown.md

// 반환 타입을 직접 적지 않았어요. 모든 return 이 문자열이라 string 으로 추론돼요.
function formatStudyWeek(week: unknown) {
  if (typeof week === "number") {
    return "현재 " + week + "주차예요.";
  }

  if (typeof week === "string") {
    return "입력한 주차: " + week;
  }

  return "주차를 확인할 수 없어요.";
}

console.log(formatStudyWeek(1));
console.log(formatStudyWeek("1주차"));
console.log(formatStudyWeek(null));
console.log(formatStudyWeek({ week: 1 }));

export {};
