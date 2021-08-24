import axios from "axios";

export const post = (url : string, params = {}) => {
  return axios.post(url, params).then(resp => {
    return resp.data;
  }).catch(err => {
    throw err;
  });
};

export const get = (url : string, params = {}) => {
  return axios.get(url, {
    params : params
  }).then(resp => {
    return resp.data;
  }).catch(err => {
    throw err;
  });
};

export const remove = (url : string, params = {}) => {
  return axios.delete(url, {
    data : params
  }).then(resp => {
    return resp.data;
  }).catch(err => {
    throw err;
  })
};

export const put = (url : string, params = {}) => {
  return axios.put(url, params).then(resp => {
    return resp.data;
  }).catch(err => {
    throw err;
  });
};