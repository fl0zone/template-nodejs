import express from 'express'
import validateFieldCreateComment from '../validator/validateFieldCreateComment'
import { createCommentCtrl } from '../controllers/comments.ctrl'
const router = express.Router()

router.post('/create',validateFieldCreateComment,createCommentCtrl)
router.get('/comments', async (req, res) => {
})
export default router