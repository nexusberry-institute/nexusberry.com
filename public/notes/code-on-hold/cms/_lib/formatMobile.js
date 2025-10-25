// desired outreach pattern " +92 0321 - 8820892 " => 923218820892
export function formatMobile(mobile) {
  const inMobile = mobile;
  // reomove leading and trailing whitespace
  // " +92 0321 - 8820892 " => "+92 0321 - 8820892" 
  mobile = mobile.trim();

  // remove all between spaces 
  // "+92 0321 - 8820892" => "+920321-8820892" 
  mobile = mobile.replace(/ /g, "");

  // has length at least 10 
  if (mobile.length < 10) return inMobile;

  // does not contain any alphabet
  if ([...mobile].some(char => char.match(/[a-z]/i))) return inMobile;

  // build right to left
  // mobile="+920321-8820892" => result="8820892" 
  let result = mobile.slice(-7);
  if ([...result].some(c => !Number.isInteger(parseInt(c)))) return inMobile;


  // remove if hyphens or parenthesis at 8th last position
  // "+920321-8820892" => "+9203218820892"
  const index = mobile.length - 8;
  if (!Number.isInteger(parseInt(mobile.charAt(index)))) {
    mobile = mobile.slice(0, index) + mobile.slice(index + 1)
  }
  // ensure digit 3 is at 10th last position
  if (mobile.charAt(mobile.length - 10) !== "3") return inMobile;

  // Take lasst 10 chars
  // "+9203218820892" => "923218820892"
  return "92" + mobile.slice(-10);
}