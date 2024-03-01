var mongoose = require('mongoose')
const CreditTopupLelevel = mongoose.model('Credittopup')

const credittopuplevels = [8, 10, 15, 45, 50, 100, 150, 300, 450, 500, 1000]

export default function () {
  CreditTopupLelevel.collection.drop()
  credittopuplevels.forEach((level) => {
    console.log('level : ', level)
    const creditTopupLelevel = new CreditTopupLelevel({ level: level })
    creditTopupLelevel.save()
  })
}
