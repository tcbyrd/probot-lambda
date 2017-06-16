module.exports = robot => {
  robot.on('foo', (a) => console.log);
  robot.on('foo', (a,b) => console.log);
}
