import { Request, Response, NextFunction } from 'express'
//import randomstring from 'randomstring'
import { model } from 'mongoose'
import { User } from 'models'
import passport from 'passport'
const UserModel = model<User>('User')
// const IPAddressModel = model<IPAddress>('IPAddress')

export function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    'login',
    { session: false },
    function (err: any, user: User, info: any) {
      if (err) {
        return res
          .status(422)
          .json({ success: false, message: err.errors?.message })
      }

      if (!user) {
        return res.status(422).json(info)
      }

      return res.json(user.toAuthJSON())
    }
  )(req, res, next)
}

export function logout(req: Request, res: Response, next: NextFunction) {
  return res.json({ success: true })
}

export function signup(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    'signup',
    { session: false },
    function (err: any, user: User) {
      if (err) {
        return res.status(422).json({ success: false, message: err.message })
      }
      if (!user) return res.json({ success: false })
      return res.json({ success: true })
    }
  )(req, res, next)
}

export async function verify(req: Request, res: Response) {
  const user = await UserModel.findById(req.payload.id)
  if (!user) {
    return {
      success: false,
      message: 'Invalid User',
    }
  }

  return res.json({ user: user.toAuthJSON() })
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  password: string
) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      message: 'Invalid User',
    }
  }

  if (!user.validPassword(currentPassword)) {
    return {
      success: false,
      message: 'Password does not match',
    }
  }

  user.setPassword(password)
  await user.save()

  return {
    success: true,
    message: 'Your password has been successfully changed',
  }
}

/*
export async function deleteAccount(req: Request, res: Response) {}*/

/*export async function checkIpAdress(req, user, res) {
  let ipEqual = false
  const whitelist = await IPAddress.find({ userId: user._id })
  whitelist.forEach((val) => {
    if (req.connection.remoteAddress.toString() === val.address.toString()) {
      // main code
      // if("192.168.10.5" === val.address.toString()){                          // exam code
      ipEqual = true
    }
  })
  if (!ipEqual) {
    let result = await User.findOne({ _id: user._id })
    if (result.ipEnable) {
      verifyCode = randomstring.generate(16) //makeverify(15);
      var curDate = new Date()
      verify = {
        code: verifyCode,
        validat_time: add_minutes(curDate, 10),
        url:
          'http://localhost:3000/user_verify?userId=' +
          user._id +
          '&verifycode=' +
          verifyCode,
      }
      verifyCodeUpdate(user._id, verify)
      sendMail(req)
      return false
    } else {
      try {
        addIpAddress(req, user.id)
      } catch (error) {
        console.log('Ip Address is duplicated.')
      }
      return true
    }
  }
  return true
}

const addIpAddress = function (req, userId) {
  try {
    existIp = IPAddress.find({ Address: req.connection.remoteAddress })
    if (!existIp) {
      const browser = req.useragent.browser || 'unknown'
      const addr = new IPAddress({
        address: req.connection.remoteAddress, //'192.168.10.2',
        browser: browser,
        userId: userId,
      })
      addr.save()
    }
  } catch (e) {
    console.log(e)
  }
}

var verifyCodeUpdate = async function (userId, verify) {
  await User.findByIdAndUpdate(
    userId,
    { $set: { verify: verify } },
    { upsert: true },
    function (err, result) {
      if (err) {
        console.log(err)
      } else {
        return result
      }
    }
  )
}

var add_minutes = function (dt, minutes) {
  return new Date(dt.getTime() + minutes * 60000)
}
const sendMail = function (req) {
  // send email
  // let transport = nodemailer.createTransport({
  //   host: 'smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //      user: 'put_your_username_here',
  //      pass: 'put_your_password_here'
  //   }
  // });
  // const message = {
  //   from: 'elonmusk@tesla.com', // Sender address
  //   to: 'to@email.com',         // List of recipients
  //   subject: 'Design Your Model S | Tesla', // Subject line
  //   text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
  // };
  // transport.sendMail(message, function(err, info) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(info);
  //   }
  // });
}*/

// const moment = required("moment")
/*const userVerify = async function (req, res, next) {
  // userId/:verifyCode
  const user = new User()
  let result = await User.findById({ _id: req.params.userId })
  if (!result) {
    return res.status(422).json({
      success: false,
      errors: {
        message: 'Can not find user.',
      },
    })
  }
  var curDate = new Date()
  if (
    req.params.verifyCode === result.verify.code &&
    curDate.valueOf() <= Date.parse(result.verify.validat_time).valueOf()
  ) {
    verify = null
    verifyCodeUpdate(req.params.userId, verify)
    addIpAddress(req, req.params.userId)
    user.token = user.generateJWT()
    return res.json(user.toAuthJSON())
  } else {
    res.json({
      success: false,
      message: 'time out verify!',
    })
  }
}*/
