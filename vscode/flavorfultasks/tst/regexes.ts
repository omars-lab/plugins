
// https://stackoverflow.com/questions/33535879/how-to-run-typescript-files-from-command-line

const task_regex = /^\s*- \[ \].*$/;
const done_regex = /@done\([^)]+\)/;
const now = new Date('05 October 2011 14:48 UTC');

function test_regex(regex:RegExp, text:string, expected_match:boolean) {
   const success_path_1 = expected_match && regex.test(text);
   const success_path_2 = !expected_match && !regex.test(text);
   const failure_path_1 = expected_match && !regex.test(text);
   const failure_path_2 = !expected_match && regex.test(text);
   if (failure_path_1 || failure_path_2) {
      console.log(`FAILURE: ${text}`);
   } 
   else {
      console.log(`SUCCESS: ${text}`);
   }
}

function test() {
   test_regex(
      task_regex, 
      "- [ ]", 
      true
   );
   test_regex(
      task_regex, 
      "         - [ ] asdfasdf", 
      true
   );
   test_regex(
      task_regex, 
      "         - [ ]", 
      true
   );
   test_regex(
      task_regex, 
      "         -  [ ]", 
      false
   );
   console.log("     - [ ] ".replace("- \[ \]", "- [x]"));
   console.log("@done(asdfasdfasdf) after done".replace(done_regex, ""));
   console.log("@done(asdfasdfasdf after done".replace(done_regex, ""));
   // console.log("@done(asdfasdfasdf)".replace("@done[\(][^\)]\+[\)]", ""));
   console.log(now.toISOString());
}

test();