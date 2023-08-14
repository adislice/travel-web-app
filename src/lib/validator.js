import { validationResult } from "express-validator"
function initMiddleware(middleware) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
  }
}

function validateMiddleware(validations, validationRes) {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))
    const errors = validationRes(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(422).json({ errors: errors.array() })
  }
}

export async function validate(req, res, validation) {
  try {
    let validateBody = initMiddleware(
      validateMiddleware(validation, validationResult)
    )
    await validateBody(req, res)
  } catch (error) {
    throw error
  }

}