// 선택 미션 2: studyHour || 1 과 studyHour ?? 1 의 결과가 다른 이유
// 기록: notes/mission.md

const studyHour: number | undefined = 0;

console.log("studyHour || 1 =", studyHour || 1); // 1
console.log("studyHour ?? 1 =", studyHour ?? 1); // 0

export {};
