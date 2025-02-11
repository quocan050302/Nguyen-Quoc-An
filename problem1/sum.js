var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};
console.log("sum_to_n_a", sum_to_n_a(6));

var sum_to_n_b = function (n) {
  let sum = (n * (n + 1)) / 2;
  return sum;
};
console.log("sum_to_n_b", sum_to_n_b(5));

var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};

console.log("sum_to_n_c", sum_to_n_c(4));
