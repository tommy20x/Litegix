import { model } from 'mongoose'
import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import validate from 'routes/validate'
import { Explorer } from 'models'
const ExplorerModel = model<Explorer>('Explorer')

const router = Router()

router.get('/', async function (req: Request, res: Response) {
  const explorers = await ExplorerModel.find()
  const results: any[] = []
  explorers.forEach((it) => {
    if (!results.find((x) => x.username === it.username)) {
      results.push(it)
    }
  })
  return res.json({
    explorers: results.map((it) => it.toAccount()),
  })
})

router.post(
  '/',
  body('username').notEmpty(),
  body('password').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    const explorer = new ExplorerModel(req.body)
    const result = await explorer.save()
    return res.json(result)
  }
)

router.delete('/', async function (req: Request, res: Response) {
  await ExplorerModel.remove()
  return res.json({
    success: true,
  })
})

export default router
