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

        var graphBody = {"query": graphqlQuery}

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
                    }
            )
        })

    } catch (err) {
        console.log(err)
    }
}

function mutateOrder(graphqlMutation) {

    try {
        var graphBody = {"query": graphqlMutation}

        console.log('graphBody ', graphBody)

        return new Promise((resolve, reject)=> {
            request.post(constants.graphUrl,
                {
                    headers: {'x-api-key': constants.graphApiKey},
                    body: graphBody,
                    json: true },

                    (err, res, data) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }

                        console.log(data)
                        resolve(data)
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


//the method name that you export has to be a different name 
module.exports.updateOrder = async function updateOrder(graphqlMutation) {
    let res = await mutateOrder(graphqlMutation)
    return res
}