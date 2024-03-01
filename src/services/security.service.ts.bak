const valiator = require('express-validator')
const mongoose = require('mongoose')
const Securities = mongoose.model('Securities')

// const getTypes = function(req, res){
// }

// const getProtocols = function(req, res){

// }
const deployRule = function (req: Request, res: Response) {}
const getData = async function (req: Request, res: Response) {
  try {
    const securities = await Securities.find({ user: req.payload.id })
    return res.json({
      success: true,
      data: { securities },
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const getByIdData = async function (req: Request, res: Response) {
  try {
    const securities = await Securities.findById(req.params.firewallId)
    return res.json({
      success: true,
      data: { securities },
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const firewalls = async function (req: Request, res: Response) {
  let errors = valiator.validationResult(req)
  if (!errors.isEmpty()) return res.status(423).json({ errors: errors.array() })

  try {
    let result = await Securities.findOne({ ip_address: req.body.ip_address })
    if (result) {
      return res.status(422).json({
        success: false,
        errors: {
          ip_address: 'has already been taken.',
        },
      })
    }
    const securities = new Securities(req.body)
    securities.user = req.payload.id
    securities.server_id = req.server.id
    await securities.save()

    res.json({
      success: true,
      message: 'Your security has been successfully saved.',
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const deleteRule = async function (req: Request, res: Response) {
  try {
    const securities = await Securities.findOneAndDelete(req.params.firewallId)

    return res.json({
      success: true,
      data: { securities },
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

export default {
  firewalls,
  getData,
  getByIdData,
  deployRule,
  deleteRule,
}
