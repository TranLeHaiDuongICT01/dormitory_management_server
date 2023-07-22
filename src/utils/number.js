function random10Digits() {
  var digits = "0123456789";
  var randomNumber = "";
  for (var i = 0; i < 10; i++) {
    randomNumber += digits[Math.floor(Math.random() * 10)];
  }
  return randomNumber;
}

module.exports = {
  random10Digits,
};
