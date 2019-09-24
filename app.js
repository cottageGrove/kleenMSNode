const express = require('express')
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
const cors = require('cors')
var graphqlHandler = require('./graphqlHandler')


AWS.config.region = process.env.REGION

var sns = new AWS.SNS();
var ddb = new AWS.DynamoDB();


var ddbTable = process.env.STARTUP_SIGNUP_TABLE
var snsTopic = process.env.NEW_SIGNUP_TOPIC
var app = express()

var port = process.env.PORT || 3000
var docClient = new AWS.DynamoDB.DocumentClient()

// app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

var cost = 25
app.post('/orders', function(req, res ){

    var item = {
        '__typename': {'S': 'Order'},
        'createdAt': {'S': Date.now().toString()},
        'deliveryTime': {'S': '14:00'},
        'dropoffDate': {'S': '9/12/2019'},
        'id': {'S': req.body.id},
        'orderID': {'S': 'FED'},
        'orderLaundryId': {'S': 'abcdefghijklmnop'},
        'orderUserId': {'S': 'ghijklmno'},
        'pickupDate': {'S' : '9/13/2019'},
        'status': {'S' : 'processing'},
        'totalCost': {'N' : cost.toString()},
        'updatedAt': {'S' : '2019-03-31T13:32:19.009Z'}
    }

    ddb.putItem({
        'TableName': ddbTable,
        'Item': item,
    }, function(err, data) {

        if (err) {
            var returnStatus = 500
            console.log(err)
            return res.json(err)
        }

        console.log(data)
        res.json({msg: 'Successfully inserted new order' })
    })
    // return res.json({msg: 'Successfully inserted'})
    
})

app.post('/orders')

app.get('/orders', (req, res) => {
    // var params = {
    //     'TableName': ddbTable,
    //     'KeyConditionExpression': "#typename = :typename",
    //     'ExpressionAttributeNames': { "#typename": "__typename" },
    //     'ExpressionAttributeValues': {
    //         ":typename": 'Order'
    //     }
    // }

    var params = {
        'TableName': ddbTable,
    }


    docClient.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to scan the table. ERROR JSON', JSON.stringify(err, null, 2))
            return res.json(err)
        } else {
            console.log('Scan succeeded')
            console.log(data)
            return res.json(data)
        }
    })

})

app.post('/graphOrder', (req, res)=> {

    let order = req.body 

    console.log(order)

    let graphqlMutation = `mutation updateOrder {
        updateOrder(input: {
          id: "${order.id}"
          status: "${order.status}"
        }) 
        {id status} 
      } `

      try {
        let results = graphqlHandler.updateOrder(graphqlMutation)
        results.then(graphRes => {
            console.log("Returning update order promise from graphql api call ", graphRes)
            return res.json(graphRes.data.updateOrder)
        }).catch(err => {
            return res.json(err)
        })
      } catch (err) {
        return res.json(err)
      }
})


app.get('/graphOrders', (req,res) => {

    let graphqlQuery = `query listOrders {
        listOrders(limit: 200, nextToken: null) {
            items{ 
             
              id
              pickupDate
              dropoffDate
              deliveryTime
              totalCost
            
              laundry {
                baskets
                washType
                detergent
              }
            }
        }
    } `

    try {
        // console.log(req.body)
        let results = graphqlHandler.getOrders(graphqlQuery)

        //Promise will return data 
        results.then(graphRes => {
            // console.log(data)
            console.log("Returning promise from graphql api call ", graphRes.data.listOrders.items)
            return res.json(graphRes.data.listOrders.items)
            
        })
    } catch(err) {
        console.log(err)
        res.json(err)
    }

})

app.listen(port, function() {
    console.log('Server running on localhost:' + port + '/')
})

// app.get('/orders', function(req, res) {
    
// })