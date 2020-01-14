const VSHADER_SOURCE = `
// 定义变量
attribute vec4 a_Position;
uniform mat4 u_xformMatrix;
void main() {
    gl_Position = u_xformMatrix * a_Position;
    // gl_PointSize = 10.0;
}`;

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

    const n = initVertexBuffers(gl);

    if (n < 0) {
        console.warn('fail')
        return;
    }
    // 处理旋转
    // rotate(gl, 60.0)

    // 平移
    // translate(gl, 0.5, 0.5, 0);

    // 缩放
    // zoom(gl, 0.5, 0.5, 0.5);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    let zoomStore = 1.0;
    can.addEventListener('mousewheel', function (e) {
        if (event.wheelDelta > 0) {
            zoomStore += 0.1
        } else {
            if (zoomStore > 0.2) {
                zoomStore -= 0.1
            }
        }
        zoom(gl, zoomStore, zoomStore, zoomStore);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, false)

    can.addEventListener('mousemove', function (e) {
        if (e.buttons !== 1) return;
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

        translate(gl, glOffsetX, -glOffsetY, 1);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, false)
}


function initVertexBuffers(gl) {
    const point = [[0.0, 0.5], [-0.5, -0.5], [0.5, -0.5]]
    const vertices = new Float32Array([...point.flat()]);
    const n = 3;

    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.warn('fail')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲过去对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}
// 旋转矩阵
function rotate(gl, ANGLE) {
    const radian = Math.PI * ANGLE / 180.0;
    const cosB = Math.cos(radian);
    const sinB = Math.sin(radian);

    const matrix = [
        [cosB, sinB, 0.0, 0.0],
        [-sinB, cosB, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ]

    setMatrix(gl, matrix);
}
// 平移矩阵
function translate(gl, x, y, z) {
    const matrix = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [x, y, z, 1.0]
    ]
    setMatrix(gl, matrix);
}
// 缩放矩阵
function zoom(gl, x, y, z) {
    const matrix = [
        [x, 0.0, 0.0, 0.0],
        [0.0, y, 0.0, 0.0],
        [0.0, 0.0, z, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]
    setMatrix(gl, matrix);
}
// 把矩阵数据写入
function setMatrix(gl, matrix) {
    const xforMatrix = new Float32Array([...matrix.flat()])

    const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix, false, xforMatrix);
}

window.onload = main;
