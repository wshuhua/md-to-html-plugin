function randomNum() {
  return +new Date() + parseInt(Math.random() * 1000);
}

module.exports = {
    randomNum
}