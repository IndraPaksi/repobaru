const { autoCode } = require('../model/autocode')
const moment = require('moment')

checkMonthCode = (yymm, code) => {
    return autoCode.findOne({ code, yymm }).count()
}

initMonthCode = (yymm, code) => {
    const doc = {
        code: code,
        description: 'Auto Code Form Consent Registration', // please change
        yymm: yymm,
        currentNo: Math.floor(Math.random() * 1000)
    }
    return autoCode.create(doc)
}

module.exports = {
    getCode(code) {
        return new Promise((resolve, reject) => {
            const yymm = moment().format('YYMM')
            console.log('yymm', yymm)
            checkMonthCode(yymm, code).then(cnt => {
                if (cnt > 0) {
                    console.log("cnt", cnt)
                    autoCode.findOne({ code }).then(data => {
                        const currentNo = data.currentNo + Math.floor(Math.random() * 1000) + ''
                        console.log(currentNo)
                        const code = 'FC-' + yymm + currentNo.padStart('3', '0')
                        resolve(code)
                    }).catch(error => {
                        reject(error)
                    })
                } else {
                    initMonthCode(yymm, code).then(data => {
                        const currentNo = data.currentNo + ''
                        const code = 'FC-' + yymm + currentNo.padStart('3', '0')
                        resolve(code)
                    })
                }
            })
        })

    },
    updateMonthCode(yymm, code) {
        const doc = {
            code, yymm
        }
        autoCode.findByIdAndUpdate(doc, { $inc: { currentNo: 1 } })
    }
}