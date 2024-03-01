import { model } from 'mongoose'
import { Plan } from 'models'
const PlanModel = model<Plan>('Plan')

export async function getPlans() {
  const plans = await PlanModel.find({})
  return {
    success: true,
    data: { plans },
  }
}

export async function createPlan(name: string, price: number) {
  const exists = await PlanModel.findOne({ name })
  if (exists) {
    throw Error('Plan name has already been taken.')
  }

  const plan = new PlanModel({
    name,
    price,
  })
  const created = await plan.save()

  return {
    success: true,
    data: { plan: created },
  }
}

export async function deletePlan(planId: string) {
  const plan = await PlanModel.findById(planId)
  if (!plan) {
    throw Error("It doesn't exists")
  }

  await plan.remove()

  return {
    success: true,
    data: { id: planId },
  }
}
