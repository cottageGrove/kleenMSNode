var request = require('request')
var constants = require('./constants')

function retrieveOrders(graphqlQuery) {

    var options = {
        method: 'POST',
        headers: {
            'x-api-key': constants.graphApiKey
        }
    }

    try {
        // console.log(graphqlQuery)

        var graphBody = {"query": graphqlQuery}

        // console.log(graphBody)

        return new Promise((resolve, reject)=> {
            request.post(constants.graphUrl,
                {
                    headers: {'x-api-key': constants.graphApiKey}, 
                    body: graphBody,
                    json: true  },
    
                    (err, res, data) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }  
                        resolve(data)
                            // console.log(data)
                    }
            )

        })

    } catch (err) {
        console.log(err)
    }
}

module.exports.getOrders = async function getOrders(graphqlQuery) {
    let res = await retrieveOrders(graphqlQuery)
    return res 
}