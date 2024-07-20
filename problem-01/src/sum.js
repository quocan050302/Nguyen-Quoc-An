var sum_to_n_a = function (n) {
  let a = 1;
  let sum = 0;
  while (a <= n) {
    sum += a++;
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
  function helper(current, sum) {
    if (current > n) {
      return sum;
    }
    return helper(current + 1, sum + current);
  }
  return helper(1, 0);
};

console.log("sum_to_n_c", sum_to_n_c(4));
