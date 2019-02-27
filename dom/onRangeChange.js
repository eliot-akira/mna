
export default function onRangeChange(r, f) {
  let n, c, m
  r.addEventListener("input", function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c})
  r.addEventListener("change", function(e){if(!n)f(e)})
}
