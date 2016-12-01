import $ from 'jquery';
import R from 'ramda';
import { put } from 'redux-saga/effects';

const util = {
  defineLog: () => {
    Array.prototype.log = function () { console.log(this); return this; };
  },

  post: (url, data) => {
    return fetch(url, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  fetch: function* (url, h, t = false) {
    let d = null;
    if (R.is(Object, url)) {
      d = url;
      url = t ? '/api/text' : '/api/json';
    }
    try {
      let data = yield (d ? util.post(url, d) : fetch(url)).then(x => t ? x.text() : x.json());
      //console.log(data);
      yield put(h(data));
    } catch (e) {
      yield put({type: 'error', e})
    }
  }
}

export default util;