const storageModel = require('../models/storageModel')

const storageAction = async (req, res) => {
    try {
        const newRecord = new storageModel({
            owner: req.body.userId,
            from: req.body.from,
            action: req.body.action,
            amount: req.body.value,
            createDate: Date.now()
        })

        await newRecord.save()

        res.status(200).send({
            success: true,
            message: 'API Work!'
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const getStorage = async (req, res) => {
    await storageModel.find({
        owner: req.body.userId
    }).then(records => {

        let income = 0
        let outcome = 0
        let incomeMonth = 0
        let outcomeMonth = 0

        const beginMonth = (new Date(`${(new Date()).getFullYear()}/${(new Date()).getMonth() + 1}/1`)).getTime()

        records.forEach(record => {
            if (record.action === 'push') {
                income = income + Number(record.amount)
                if (record.createDate >= beginMonth && record.createDate <= Date.now()) {
                    incomeMonth = incomeMonth + Number(record.amount)
                }
            } else {
                outcome = outcome + Number(record.amount)
                if (record.createDate >= beginMonth && record.createDate <= Date.now()) {
                    outcomeMonth = outcomeMonth + Number(record.amount)
                }
            }
        })

        res.status(200).send({
            success: true,
            storage: {
                total: income - outcome,
                income: income,
                outcome: outcome,
                this_month: {
                    total: incomeMonth - outcomeMonth,
                    income: incomeMonth,
                    outcome: outcomeMonth
                }
            }
        })
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message
        })
    })
}

const getChart = async (req, res) => {
    try {
        const mapTime = new Map()

        const labels = []
        const incomeData = []
        const outcomeData = []

        let month = (new Date).getMonth()
        let year = (new Date).getFullYear()

        let counterLabel = 10
        while (counterLabel--) {
            labels.unshift(`${month}/${year}`)
            mapTime.set(`${month}/${year}`, {
                income: 0,
                outcome: 0
            })
            month = month - 1
            if (month === 0) {
                month = 12
                year = year - 1
            }
        }

        await storageModel.find({
            owner: req.body.userId
        }).then(records => {

            records.forEach(record => {
                let recordMonth = (new Date(record.createDate)).getMonth() + 1
                let recordYear = (new Date(record.createDate)).getFullYear()

                if (labels.indexOf(`${recordMonth}/${recordYear}`) === -1) return

                if (record.action === 'push') {
                    mapTime.set(`${recordMonth}/${recordYear}`, {
                        ...mapTime.get(`${recordMonth}/${recordYear}`),
                        income: mapTime.get(`${recordMonth}/${recordYear}`).income + Number(record.amount)
                    })
                } else {
                    mapTime.set(`${recordMonth}/${recordYear}`, {
                        ...mapTime.get(`${recordMonth}/${recordYear}`),
                        outcome: mapTime.get(`${recordMonth}/${recordYear}`).outcome + Number(record.amount)
                    })
                }
            })

            labels.forEach(label => {
                incomeData.push(mapTime.get(label).income)
                outcomeData.push(mapTime.get(label).outcome)
            })

            const chart = {
                labels: labels,
                datasets: [
                    {
                        label: 'Thu vào',
                        data: incomeData,
                        backgroundColor: '#cf1322',
                        stack: '0'
                    },
                    {
                        label: 'Lấy ra',
                        data: outcomeData,
                        backgroundColor: '#3f8600',
                        stack: '1'
                    },
                ]
            }

            res.status(200).send({
                success: true,
                chart: chart
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

const getHistory = async (req, res) => {
    await storageModel.find({
        owner: req.body.userId,
        action: req.body.action === 'all' ? { $exists: true } : req.body.action,
        createDate: {
            $gte: req.body.time === 0 ? 0 : (Date.now() - Number(req.body.time))
        }
    }).sort({createDate: -1}).then(records => {
        res.status(200).send({
            success: true,
            list: records
        })
    }).catch(err => {
        console.log(err)
        message.error(err.message)
    })
}

module.exports = {
    storageAction,
    getStorage,
    getChart,
    getHistory
}