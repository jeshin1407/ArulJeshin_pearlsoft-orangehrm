import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const BASE = __ENV.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export const options = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  stages: [
    { duration: '15s', target: 2 },
    { duration: '30s', target: 2 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
    checks: ['rate>0.95'],
  },
};

function login() {
  try { http.cookieJar().clear(BASE); } catch (e) {}

  const page = http.get(`${BASE}/web/index.php/auth/login`);
  const m = String(page.body).match(/:token="&quot;([^&]+)&quot;"/);
  if (!m) {
    console.log(`VU ${__VU} login page status ${page.status}, no token found`);
    return false;
  }
  const res = http.post(
    `${BASE}/web/index.php/auth/validate`,
    { _token: m[1], username: 'Admin', password: 'admin123' },
    { redirects: 0 }
  );
  return res.status === 302;
}

export default function () {
  if (!login()) {
    sleep(2);
    return;
  }

  const unique = `${String(Date.now()).slice(-6)}${__VU}${__ITER % 100}`;

  const payload = JSON.stringify({
    firstName: `Perf${__VU}`,
    middleName: '',
    lastName: `User${__ITER}`,
    empPicture: null,
    employeeId: unique,
  });

  const res = http.post(`${BASE}/web/index.php/api/v2/pim/employees`, payload, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  if (res.status !== 200 && __ITER < 3) {
    console.log(`VU ${__VU} create status ${res.status} body ${String(res.body).slice(0, 150)}`);
  }

  check(res, { 'employee created (200)': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'perf/reports/employee-create.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: false }),
  };
}