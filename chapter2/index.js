const VSHADER_SOURCE = `
// 定义变量
attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}`;
// const VSHADER_SOURCE = `void main() {
//     gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
//     gl_PointSize = 10.0;
// }`;
// const FSHADER_SOURCE = `void main() {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// }`;
const FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor;
}`;
function main() {
  const can = document.getElementById("can");
  const gl = can.getContext("webgl");

  window.gl = gl;

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.warn("fail");
    return;
  }
  // 从webgl系统中拿到变量
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

  // 通过js设置webgl系统的变量
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.vertexAttrib1f(a_PointSize, 15.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 1);

  can.addEventListener(
    "mousemove",
    function(e) {
      click(e, gl, can, a_Position);
    },
    false
  );

  function click(e, gl, can) {
    const x = e.clientX;
    const y = e.clientY;
    const {
      x: canX,
      y: canY,
      width: canW,
      height: canH
    } = can.getBoundingClientRect();
    // console.log(canX, canY, canW, canH);
    const offsetX = x - canX;
    const offsetY = y - canY;

    let glOffsetX = (offsetX * 2) / canW;
    let glOffsetY = (offsetY * 2) / canH;

    glOffsetX--; // -1 ~ 1
    glOffsetY--;

    const glColor = (glOffsetY + glOffsetX) / 4 + 0.5;

    // console.log(glColor);

    // console.log(glOffsetX, glOffsetY);
    // 通过js设置webgl系统的变量
    gl.vertexAttrib3f(a_Position, glOffsetX, -glOffsetY, 0.0);
    gl.vertexAttrib1f(a_PointSize, 15.0);
    gl.uniform4f(u_FragColor, glColor, 0.0, 0.0, 1.0);
    // gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

window.onload = function() {
  main();
};
