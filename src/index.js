var values = { a: 1 };

function impureFunction(items) {
  var b = 1;

  if (b == 1) {
    items.a = items.a * b + 2;
  }

  return items.a;
}

var c = impureFunction(values);
// Now `values.a` is 3, the impure function modifies it.

var values2 = { a: 1 };

function pureFunction(a) {
  var b = 1;

  a = a * b + 2;

  return a;
}

var d = pureFunction(values.a);
// `values.a` has not been modified, it's still 1
