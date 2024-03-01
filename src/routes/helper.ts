import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import errorMessage from 'routes/errors'

export function validate(req: Request, res: Response, next: NextFunction) {
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

export function createHandler(callback: (req: Request) => object) {
  return async function (req: Request, res: Response) {
    try {
      return res.json(await callback(req))
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
}

export function createHandlerAndSendText(callback: (req: Request) => object) {
  return async function (req: Request, res: Response) {
    try {
      return res.send(await callback(req))
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
}
