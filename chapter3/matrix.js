// 矩阵（4*4）与点（4）相乘
function multiplyMatrixAndPoint(matrix, point) {

    // 给矩阵的每一部分一个简单的变量名, 列数（c）与行数（r）
    var c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
    var c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
    var c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
    var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

    // 定义点坐标
    var x = point[0];
    var y = point[1];
    var z = point[2];
    var w = point[3];

    // 点坐标和第一列对应相乘, 再求和
    var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

    // 点坐标和第二列对应相乘, 再求和
    var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

    // 点坐标和第三列对应相乘, 再求和
    var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

    // 点坐标和第四列对应相乘, 再求和
    var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

    return [resultX, resultY, resultZ, resultW]
}

// 两个矩阵相乘
function multiplyMatrices(matrixA, matrixB) {

    // 将第二个矩阵按列切片
    var column0 = [matrixB[0], matrixB[4], matrixB[8], matrixB[12]];
    var column1 = [matrixB[1], matrixB[5], matrixB[9], matrixB[13]];
    var column2 = [matrixB[2], matrixB[6], matrixB[10], matrixB[14]];
    var column3 = [matrixB[3], matrixB[7], matrixB[11], matrixB[15]];

    // 将每列分别和矩阵相乘
    var result0 = multiplyMatrixAndPoint(matrixA, column0);
    var result1 = multiplyMatrixAndPoint(matrixA, column1);
    var result2 = multiplyMatrixAndPoint(matrixA, column2);
    var result3 = multiplyMatrixAndPoint(matrixA, column3);

    // 把结果重新组合成矩阵
    return [
        result0[0], result1[0], result2[0], result3[0],
        result0[1], result1[1], result2[1], result3[1],
        result0[2], result1[2], result2[2], result3[2],
        result0[3], result1[3], result2[3], result3[3]
    ]
}