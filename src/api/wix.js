import request from '@/utils/request'

export function wixFindList(query) {
  return request({
    url: '/wix-data/find-list',
    method: 'get',
    params: query
  })
}

export function wixGet(id) {
  return request({
    url: '/wix-data/get',
    method: 'get',
    params: { id }
  })
}

export function wixDelete(id) {
  return request({
    url: '/wix-data/delete',
    method: 'delete',
    params: { id }
  })
}

export function wixCreate(data) {
  return request({
    url: '/wix-data/create',
    method: 'post',
    data
  })
}

export function wixUpdate(data) {
  return request({
    url: '/wix-data/update',
    method: 'post',
    data
  })
}
