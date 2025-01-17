const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require("../middleware/checkRoleMiddleware");

router.get('/login_or_reg', authMiddleware, userController.loginOrRegistration)
router.get('/auth', authMiddleware, userController.check)
router.put('/update', authMiddleware, userController.update)
// router.post('/getbylogin', userController.findByLogin)
router.post('/getbyid', authMiddleware, userController.findById)
router.post('/getbyname', authMiddleware, userController.findByName)
router.get('/getreaderbooks', authMiddleware, userController.getReaderBooks)
router.get('/getauthorbooks', authMiddleware, userController.getAuthorBooks)
router.put('/changerole', checkRole('moder'), userController.changeRole)
router.put('/authorrequest', authMiddleware, userController.setAuthorRequest)
router.put('/rejectauthor', checkRole('moder'), userController.rejectAuthor)
router.get('/authorrequests', checkRole('moder'), userController.getAuthorRequests)

router.get('/', userController.getAll)
router.get('/:id', userController.getOne)

module.exports = router