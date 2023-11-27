const axios = require('axios')

/// API vị trí
let getGeocoding = async (req, res) => {

    await axios.get(`https://rsapi.goong.io/geocode?address=${req.body.locationName}&api_key=${process.env.GOONGIO_SECRET}`)
        .then((response) => {

            let addressList = []

            if (response.data.status === 'OK') {
                if (response.data.results.length) {
                    for (let i = 0; i < response.data.results.length; ++i) {
                        addressList.push({
                            name: response.data.results[i].formatted_address,
                            geometry: response.data.results[i].geometry.location
                        })
                    }

                    res.status(200).send({
                        success: true,
                        message: `Có ${response.data.results.length} địa điểm phù hợp`,
                        dataSource: addressList
                    })
                } else {
                    res.status(200).send({
                        success: false,
                        message: `Không có địa điểm phù hợp`,
                    })
                }
            } else {
                res.status(500).send({
                    success: false,
                    message: 'GOONGIO API Error!'
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}

module.exports = {
    getGeocoding,
}