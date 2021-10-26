let result={
    status:2,
}
let dbResult={
    bool:false,
}
const view = async (req, res) =>{
    let model = require('../../models/post')
    let boardType;
    switch(req.params.boardType){
        case 'board':
            boardType='board'
            break;
        case 'anonymous':
            boardType='anonymous'
            break
    }
    dbResult = await model.view(boardType, req.params.postNo)
    result={
        status:1,
        arrBoard:dbResult,
    }
    res.send(JSON.stringify(dbResult))
}
const write = (req, res) =>{
    res.send()
}
const del = (req, res) =>{
    res.send()
}

module.exports = {
    view:view,
    write:write,
    del:del,
}