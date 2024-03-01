import { model } from 'mongoose'
import { User, Company } from 'models'
const UserModel = model<User>('User')
const CompanyModel = model<Company>('Company')

export async function getProfile(userId: string) {
  const user = await UserModel.findById(userId).populate('company')
  if (!user) {
    return {
      success: false,
      errors: { message: 'Invalid user' },
    }
  }

  return {
    success: true,
    data: user.toProfileJSON(),
  }
}

export async function updateProfile(
  userId: string,
  data: {
    name: string
    email: string
    timezone: string
    loginNotification: boolean
  }
) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { message: 'Invalid user' },
    }
  }

  if (user.email != data.email) {
    return {
      success: false,
      errors: {
        message: 'Email can not be changed.',
      },
    }
  }

  user.username = data.name
  user.timezone = data.timezone
  user.loginNotification = data.loginNotification
  await user.save()

  return {
    success: true,
    data: {
      profile: user.toJSON(),
    },
  }
}

export async function updateCompany(userId: string, data: any) {
  const user = await UserModel.findById(userId).populate('company')
  if (!user) {
    return {
      success: false,
      errors: { message: 'Invalid user' },
    }
  }

  if (!user.company) {
    const company = new CompanyModel(data)
    await company.save()

    user.company = company
    await user.save()
  } else {
    user.company.name = data.name
    user.company.address1 = data.address1
    user.company.address2 = data.address2
    user.company.city = data.city
    user.company.postal = data.postal
    user.company.state = data.state
    user.company.country = data.country
    user.company.tax = data.tax
    await user.company.save()
  }
  return {
    success: true,
    data: {
      company: user.company.id,
    },
  }
}
