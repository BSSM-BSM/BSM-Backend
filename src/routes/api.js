const express = require('express')
const router = express.Router()
const jwt = require('../jwt')
const multer = require('multer')

const loginCheck = (req, res, next) => {
  const jwtValue = jwt.check(req.cookies.token);
  if(!jwtValue.isLogin){
    return res.send(JSON.stringify(jwtValue.msg));
  }
  next();
}
const imageUpload = multer({
  storage:multer.diskStorage({
    destination:(req, file, cb) => {
      const jwtValue = jwt.check(req.cookies.token);
      if(!jwtValue.isLogin) return;
      cb(null, 'public/resource/board/upload_images/')
    },
    filename:(req, file, cb) => {
      cb(null, Date.now()+'.'+file.originalname.split('.')[file.originalname.split('.').length-1])
    }
  })
})
const profileUpload = multer({
  storage:multer.diskStorage({
    destination:(req, file, cb) => {
      const jwtValue = jwt.check(req.cookies.token);
      if(!jwtValue.isLogin) return;
      cb(null, 'public/resource/member/profile_images/')
    },
    filename:(req, file, cb) => {
      const jwtValue = jwt.check(req.cookies.token);
      cb(null, 'temp-profile_'+jwtValue.memberCode+'.'+file.originalname.split('.')[file.originalname.split('.').length-1])
    }
  })
})

router.use(express.json())
router.use(express.urlencoded({extended:true}))
router.use(jwt.refreshToken)

const pushController = require('../controllers/api/push')
const versionController = require('../controllers/api/version')
const accountController = require('../controllers/api/account')
const searchController = require('../controllers/api/search')
const mealController = require('../controllers/api/meal')
const timetableController = require('../controllers/api/timetable')
const meisterController = require('../controllers/api/meister')
const boardController = require('../controllers/api/board')
const postController = require('../controllers/api/post')
const commentController = require('../controllers/api/comment')
const likeController = require('../controllers/api/like')
const imageUploadController = require('../controllers/api/imageUpload')
const emoticonController = require('../controllers/api/emoticon')

router.post('/meal/register', pushController.register)

router.get('/version/:app/:os', versionController.get)

router.post('/account/login', accountController.login)
router.post('/account/pwEdit', accountController.pwEdit)
router.get('/account/islogin', accountController.islogin)
router.post('/account/signUp', accountController.signUp)
router.get('/account/:memberCode', accountController.view)
router.post('/account/profileUpload', loginCheck, profileUpload.single('file'), accountController.profileUpload)
router.post('/account/validCode', accountController.validCode)
router.post('/account/pwResetMail', accountController.pwResetMail)

router.get('/search/:searchType/:searchStr', searchController.get)

router.get('/meal/:mealDate', mealController.get)

router.get('/timetable/:grade/:classNo', timetableController.get)

router.post('/meister/point/:grade/:classNo/:studentNo', meisterController.getPoint)
router.get('/meister/score/:grade/:classNo/:studentNo', meisterController.getScore)

router.get('/board/:boardType', boardController.view)

router.get('/post/:boardType/:postNo', postController.view)
router.post('/post/:boardType', postController.write)
router.put('/post/:boardType/:postNo', postController.update)
router.delete('/post/:boardType/:postNo', postController.del)

router.get('/comment/:boardType/:postNo', commentController.view)
router.post('/comment/:boardType/:postNo/:depth/:parentIdx', commentController.write)
router.post('/comment/:boardType/:postNo', commentController.write)
router.delete('/comment/:boardType/:postNo/:commentIdx', commentController.del)

router.post('/like/:boardType/:postNo', likeController.like)

router.post('/imageUpload', loginCheck, imageUpload.single('file'), imageUploadController.upload)

router.get('/emoticon/:id', emoticonController.getemoticon)
router.get('/emoticon', emoticonController.getemoticons)

module.exports = router