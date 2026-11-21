// 선택 미션 3: formatMemberId(input: unknown) 로 숫자, 문자열, 그 밖의 값 구분하기
// 기록: notes/mission.md

function formatMemberId(input: unknown): string {
  if (typeof input === "number" && Number.isFinite(input)) {
    return "MEMBER-" + input;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    return trimmed === "" ? "회원 ID가 비어 있어요." : trimmed.toUpperCase();
  }

  return "회원 ID를 확인할 수 없어요.";
}

console.log(formatMemberId(1)); // MEMBER-1
console.log(formatMemberId(" member-02 ")); // MEMBER-02
console.log(formatMemberId("")); // 비어 있음
console.log(formatMemberId(NaN)); // 확인 불가
console.log(formatMemberId(null)); // 확인 불가
console.log(formatMemberId({ id: 1 })); // 확인 불가

export {};
