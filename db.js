//const { Result } = require('express-validator');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bc360cea988749',
    password: '4b6e91f9',
    port: '3306',
    database: 'heroku_db02540befdb1cb',
    dateStrings: 'date' //dateString은 날짜 시간 출력
    //원래는 이렇게 쓰면 안 되고 다른데에 옮긴 후 연결하는 방식으로 해야 함
})


//리스트 전체를 불러오는 함수
function getAllMemos(callback) {
    connection.query('SELECT * FROM(SELECT *, @rownum:=@rownum+1 AS RNUM FROM notice, (SELECT @rownum :=0) AS R ORDER BY id ASC) SUB ORDER BY id DESC', (err, rows, fields) => {
        //이중쿼리를 사용하여 rownum 열을 생성, 1씩 초기화하여 이름을 RNUM으로 설정, 0으로 초기화 및 id기준 정렬
        if (err) throw err;
        callback(rows);  //모든 줄들을 받아오게 지정(표 3줄)
    });
}

//리스트에 새로운 내용을 추가하는 함수
function insertMemo(subject, date, content, author, pw, views, callback) {
    connection.query(`INSERT INTO notice(subject, date, content, author, pw, views) VALUES('${subject}', NOW(), '${content}', '${author}', '${pw}', '${views}')`, (err, result) => {
        if (err) throw err;
        callback();
    });
}

//리스트 중 ID값이 일치하는 row만 불러오는 함수
function getMemoById(id, callback) {
    connection.query(`select * from notice WHERE id = '${id}'`, (err, row, fields) => {
        if (err) throw err;
        callback(row);
    });
}

//게시글 클릭마다 조회수 카운트 함수
function countView(id) {
    connection.query(`UPDATE notice SET views = views+ 1 WHERE id = ${id}`);
}




//리스트를 수정하고 싶은 때 id값이 일치하는 부분을 수정하는 함수
function updateMemoById(id, subject, date, content, author, pw, callback) {
    connection.query(`UPDATE notice set subject='${subject}', date = now(), content='${content}', author='${author}', pw='${pw}' WHERE id=${id}`, (err, result) => {
        if (err) throw err;
        callback();
    });
}


//리스트 중 ID값이 일치하는 부분을 삭제하는 함수
function deleteMemoById(id, callback) {
    connection.query(`DELETE from notice WHERE id = ${id}`, (err, result) => {
        if (err) throw err;
        callback();
    });
}

//리스트 중 ID값이 일치하는 row만 불러오는 함수
function getViewById(id, callback) {
    connection.query(`SELECT * FROM notice WHERE id = '${id}'`, (err, row, fields) => {
        if (err) throw err;
        callback(row);
    });
}

module.exports = {
    getAllMemos,
    insertMemo,
    getMemoById,
    updateMemoById,
    deleteMemoById,
    getViewById,
    countView
};