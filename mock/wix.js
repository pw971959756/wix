const Mock = require('mockjs')
const fs = require('fs')
const { uuid ,getDateTime , getIPAddress, getHostname , getMac , getWixData, setWixData} = require('./utils')
const filepath = './data/wix-data.json'

module.exports = [
  {
    url: '/wix-data/find-list',
    type: 'get',
    response: config => {
      let result = getWixData()
      return {code: 20000, data: {total: result.length, items: result}}
    }
  },

  {
    url: '/wix-data/get',
    type: 'get',
    response: config => {
      const { id } = config.query

      let result = getWixData()
      let bean = result.filter(function (ele) {
        return ele.id === id
      })

      return {code: 20000, data: bean}
    }
  },

  {
    url: '/wix-data/delete',
    type: 'delete',
    response: config => {
      const { id } = config.query
      let result = getWixData()

      let data = result.filter(function (ele) {
        return ele.id != id
      })
      setWixData(data)

      return { code: 20000, data: 'success' }
    }
  },
  {
    url: '/wix-data/create',
    type: 'post',
    response: config => {
      const body = config.body
      body.id = uuid()
      body.lastUpdateDateTime = getDateTime()
      body.createDateTime = getDateTime()
      body.hostname = getHostname()
      body.ipAddress = getIPAddress()
      body.mac = getMac()

      let result = getWixData()
      result.push(body)
      setWixData(result)

      return {code: 20000, data: 'success'}
    }
  },
  {
    url: '/wix-data/update',
    type: 'post',
    response: config => {
      const body = config.body

      body.lastUpdateDateTime = getDateTime()
      body.hostname = getHostname()
      body.ipAddress = getIPAddress()
      body.mac = getMac()

      let result = getWixData()
      let data = result.filter(function (ele) {
        return ele.id != body.id
      })
      data.push(body)
      setWixData(data)

      return {code: 20000, data: 'success'}
    }
  }
]
