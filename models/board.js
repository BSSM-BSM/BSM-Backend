const conn = require('../db')
const getMembersLevel = require('./membersLevel')


let result=new Object();

const view = async (boardType, page, isAnonymous) => {
    let membersLevel = await getMembersLevel.get()
    return new Promise(resolve => {
        // 총 게시물 갯수
        const totalPostQuery="SELECT * FROM ?? WHERE `post_deleted`=0"
        const params=[boardType]
        conn.query(totalPostQuery, params, (error, totalPost) => {
            if(error) resolve(error)
            result=new Object();
            // 게시판 페이지 수 계산
            let totalPage, startPost, limitPost=15;
            startPost = (page-1)*limitPost;
            totalPage=Math.ceil(Object.keys(totalPost).length/limitPost);
            result.pages=totalPage;
            const boardQuery="SELECT * FROM ?? WHERE `post_deleted`=0 ORDER BY `post_no` DESC LIMIT ?, ?"
            const params=[boardType, startPost, limitPost];
            conn.query(boardQuery, params, (error, rows) => {
                if(error) resolve(error)
                if(!rows.length) resolve({status:3,subStatus:6})
                else{
                    result.arrBoard=new Array()
                    for(let i=0;i<Object.keys(rows).length;i++){
                        if(membersLevel[rows[i].member_code]>0){
                            rows[i].member_level=membersLevel[rows[i].member_code]
                        }else{
                            rows[i].member_level=0
                        }
                        if(isAnonymous){
                            rows[i].member_code=-1
                            rows[i].member_level=0
                            rows[i].member_nickname='ㅇㅇ'
                        }
                        result.arrBoard[i]={
                            boardType:boardType,
                            postNo:rows[i].post_no,
                            postTitle:rows[i].post_title,
                            postComments:rows[i].post_comments,
                            memberCode:rows[i].member_code,
                            memberNickname:rows[i].member_nickname,
                            memberLevel:rows[i].member_level,
                            postDate:rows[i].post_date,
                            postHit:rows[i].post_hit,
                            postLike:rows[i].like,
                        };
                    }
                    resolve(result)
                }
            })
        })
    })
}

module.exports = {
    view:view,
}