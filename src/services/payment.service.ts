import { model } from 'mongoose'
import { PaymentMethod, PaymentHistory } from 'models'
const PaymentMethodModel = model<PaymentMethod>('PaymentMethod')
const PaymentHistoryModel = model<PaymentHistory>('PaymentHistory')

export async function getPaymentMethods(userId: string) {
  const user: any = userId
  const payments = await PaymentMethodModel.find({ user })

  return {
    success: true,
    data: { payments },
  }
}

export async function storePaymentMethods(userId: string, data: any) {
  const user: any = userId

  const paymentMethod = new PaymentMethodModel(data)
  paymentMethod.user = user
  await paymentMethod.save()

  return {
    success: true,
    data: { id: paymentMethod.id },
  }
}

export async function getAllPaymentHistory(page: number, size: number) {
  page = Math.max(1, isNaN(page) ? 1 : page)
  size = Math.min(100, isNaN(size) ? 10 : size)

  const payments = await PaymentHistoryModel.find({ deleted: false })
    .populate('user')
    .skip((page - 1) * size)
    .limit(size)

  const total = await PaymentHistoryModel.find({ deleted: false }).count()

  return {
    success: true,
    data: {
      total,
      page,
      size,
      payments,
    },
  }
}

export async function getPageablePaymentHistory(
  userId: string,
  page: number,
  size: number
) {
  page = Math.max(1, isNaN(page) ? 1 : page)
  size = Math.min(100, isNaN(size) ? 10 : size)

  const user: any = userId
  const payments = await PaymentHistoryModel.find({ user, deleted: false })
    .skip((page - 1) * size)
    .limit(size)

  const total = await PaymentHistoryModel.find({ user, deleted: false }).count()

  return {
    success: true,
    data: { total, page, size, payments },
  }
}

export async function getPaymentHistory(userId: string) {
  const user: any = userId
  const histories = await PaymentHistoryModel.find({ user })

  return {
    success: true,
    data: { histories },
  }
}

export async function getPaymentHistoryById(paymentId: string) {
  const payment = await PaymentHistoryModel.findById(paymentId)
  return {
    success: true,
    data: { payment },
  }
}

export async function storePaymentHistory(
  userId: string,
  {
    type,
    amount,
    date,
    invoice,
    receipt,
  }: {
    type: string
    amount: number
    date: string
    invoice: string
    receipt: string
  }
) {
  const user: any = userId
  const paymentHistory = new PaymentHistoryModel({
    user,
    amount,
    type,
    date,
    invoice,
    receipt,
  })
  await paymentHistory.save()

  return {
    success: true,
    data: { paymentHistory },
  }
}

export async function deleteHistory(paymentId: string) {
  const payment = await PaymentHistoryModel.findById(paymentId)
  if (!payment) {
    throw Error("It doesn't exists")
  }

  payment.deleted = true
  await payment.save()

  return {
    success: true,
    data: { id: payment.id },
  }
}
