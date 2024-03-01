const valiator = require('express-validator')
const mongoose = require('mongoose')
//const Plan = mongoose.model("Plan")
const Credittopup = mongoose.model('Credittopup')
const Subscription = mongoose.model('Subscription')
const Serverplan = mongoose.model('Serverplan')
const Backupplan = mongoose.model('Backupplan')
const User = mongoose.model('User')
const agent = require('./agent')
const activity = require('./activity-service')
const defaultlevels = require('../routes/subscriptions/credittopup.json')

const getCredittopup = async function (req: Request, res: Response) {
  const levels = await Credittopup.find().sort({ level: 1 })
  if (levels.length == 0) levels = defaultlevels
  return res.json({
    success: true,
    levels: levels,
  })
}

const getCurrentServerPlan = async function (req: Request, res: Response) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({
        success: false,
        message: 'Invalid User',
      })
    }
    const subscription = await Subscription.find({ userId: req.payload.id })
    //console.log(subscription)
    return res.json({
      success: true,
      data: subscription,
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const createSubscription = async function (req: Request, res: Response) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({
        success: false,
        message: 'Invalid User',
      })
    }
    let subscription
    const subscriptionlist = await Subscription.find({
      userId: req.payload.id,
    })

    if (subscriptionlist.length == 0) {
      subscription = new Subscription({
        userId: req.payload.id,
        serverplan: {
          count: req.body.serverplanprice > 0 ? 1 : 0,
          price: req.body.serverplanprice,
        },
        backupplan: {
          count: req.body.backupplanprice > 0 ? 1 : 0,
          price: req.body.backupplanprice,
        },
        //userbalance : {type: Float, required: [true, "can't be blank"]},
      })
    } else {
      subscription = subscriptionlist[0]
    }

    await subscription.save()
    return res.json({
      success: true,
      data: subscription,
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const defaultServerPlans = require('../routes/subscriptions/serverplan.json')
const defaultBackupPlans = require('../routes/subscriptions/backupplan.json')
const getServerPlans = async function (req: Request, res: Response) {
  let serverPlans = await Serverplan.find().sort({ index: 1 })
  if (serverPlans.length == 0) {
    serverPlans = defaultServerPlans
    Serverplan.insertMany(serverPlans)
  }
  return res.json({
    success: true,
    data: serverPlans,
  })
}

const getBackupPlans = async function (req: Request, res: Response) {
  let backupPlans = await Backupplan.find().sort({ index: 1 })
  if (backupPlans.length == 0) {
    backupPlans = defaultBackupPlans
    Backupplan.insertMany(backupPlans)
  }
  return res.json({
    success: true,
    data: backupPlans,
  })
}

const insertUserBalance = async function (req: Request, res: Response) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({
        success: false,
        message: 'Invalid User',
      })
    }
    let subscription
    const subscriptionlist = await Subscription.find({
      userId: req.payload.id,
    })

    if (subscriptionlist.length == 0) {
      subscription = new Subscription({
        userId: req.payload.id,
        serverplan: {
          count: req.body.serverplanprice > 0 ? 1 : 0,
          price: req.body.serverplanprice,
        },
        backupplan: {
          count: req.body.backupplanprice > 0 ? 1 : 0,
          price: req.body.backupplanprice,
        },
        userbalance: req.body.credittopupamount,
      })
    } else {
      subscription = subscriptionlist[0]
      subscription.userbalance = req.body.credittopupamount
    }

    await subscription.save()
    return res.json({
      success: true,
      data: subscription,
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const active = async function (req: Request, res: Response) {
  const user = await User.findById(req.payload.id)
  if (!user) {
    return res.status(501).json({
      success: false,
      message: 'Invalid User',
    })
  }
  return res.json({
    success: true,
    data: [],
  })
}

const inactive = async function (req: Request, res: Response) {
  const user = await User.findById(req.payload.id)
  if (!user) {
    return res.status(501).json({
      success: false,
      message: 'Invalid User',
    })
  }
  return res.json({
    success: true,
    data: [],
  })
}

const canceled = async function (req: Request, res: Response) {
  const user = await User.findById(req.payload.id)
  if (!user) {
    return res.status(501).json({
      success: false,
      message: 'Invalid User',
    })
  }
  return res.json({
    success: true,
    data: [],
  })
}
export default {
  getCurrentServerPlan,
  createSubscription,
  getCredittopup,
  getServerPlans,
  getBackupPlans,
  insertUserBalance,
  active,
  inactive,
  canceled,
}
