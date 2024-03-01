import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: {
        code: 1000,
        message: 'There are some invalid parameters',
        params: errors.array().map((it) => it.param),
      },
    })
  }

  next()
}
