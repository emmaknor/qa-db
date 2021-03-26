import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  thresholds: {
    http_req_failed: [ 'rate<0.01'],
    http_req_duration: ['p(95)<200']
  },
  stages: [
    { duration: '10s', target: 1000 },
    { duration: '15s', target: 2000 },
    { duration: '15s', target: 5000 },
    { duration: '15s', target: 2000 },
    { duration: '0s', target: 0 }
  ]
};

export default function() {
  for (let i = 900011; i < 1000011; i++) {
    let res = http.get(`http://localhost:5000/questions/?product_id=${i}&page=1&count=100`);
    check(res, { 'status was 200': (r => r.status === 200)});
    sleep(1);
  }
}
