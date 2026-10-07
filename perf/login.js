import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const BASE = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '40s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const page = http.get(`${BASE}/web/index.php/auth/login`);
  const token = page.body.match(/:token="&quot;([^&]+)&quot;"/)[1];

  const res = http.post(`${BASE}/web/index.php/auth/validate`,
    { _token: token, username: 'Admin', password: 'admin123' },
    { redirects: 0 });

  check(res, { 'login redirects (302)': (r) => r.status === 302 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'perf/reports/login.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: false }),
  };
}