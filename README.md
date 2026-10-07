# Pearlsoft - Assessment OrangeHRM Automation

## What this project does
This project has automated tests for OrangeHRM employee module using Playwright and TypeScript.

It covers:
- Create, update, verify and delete employees
- Role based access checks
- Performance tests for creating employees using k6

Why Playwright and TypeScript:
- Auto wait for elements so tests are stable
- Good support for UI and API testing
- Easy to run tests in parallel
- Built in HTML reports, videos, traces and screenshots

## What you need
- Node.js 20 or above
- Git installed
- Any modern browser

## Setup steps
1. Clone the repo and open the folder in VS Code
2. Install dependencies
   ```bash
   npm ci
   ```
3. Install Playwright browser
   ```bash
   npx playwright install chromium
   ```
4. Copy the demo env file
   - On Windows
     ```bash
     copy .env.demo .env.demo
     ```
   - On Mac or Linux
     ```bash
     cp .env.demo .env.demo
     ```
   Then open .env.demo and update
   - Base URL of your OrangeHRM
   - Admin username and password

## How to run tests
Basic commands
```bash
# Run all tests
npm test

# Run only smoke tests
npm run smoke

# Run only regression tests
npm run regression

# Run only RBAC tests
npm run rbac

# Run against staging
ENV=staging npm test
```

For debugging or to see the browser
```bash
npx playwright test --headed
npx playwright test --debug
```

## Reports
- Playwright HTML report
  ```bash
  npm run report
  ```
  This opens playwright-report/index.html in your browser

- Videos and traces
  Saved under test-results. The HTML report has links to them

- k6 performance reports
  ```bash
  k6 run perf/employee-create.js
  ```
  Report is created at
  ```text
  perf/reports/employee-create.html
  ```
  Open this file in a browser to see performance results

## Folder structure
```text
orangehrm-automation/
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ src/
│  ├─ config/
│  │  └─ env.ts
│  ├─ pages/
│  │  ├─ EmployeeListPage.ts
│  │  └─ EmployeeDetailsPage.ts
│  ├─ api/
│  │  └─ employee.api.ts
│  ├─ fixtures/
│  │  └─ auth.fixture.ts
│  └─ utils/
│     └─ ...
├─ tests/
│  └─ e2e/
│     ├─ employee-lifecycle.spec.ts
│     └─ rbac.spec.ts
├─ perf/
│  ├─ login.js
│  ├─ employee-create.js
│  └─ reports/
│     └─ employee-create.html
├─ playwright.config.ts
├─ tsconfig.json
├─ package.json
├─ .env.demo
├─ .env.staging
├─ .gitignore
└─ README.md
```

## Key design choices
- Page Object Model with fixtures  
  I created page classes like EmployeeListPage and EmployeeDetailsPage. They hold locators and actions. Tests just call methods so they stay simple

- API for verification and cleanup, UI for user flows  
  Main flows like login and create or update employee are tested via UI. API is used to verify data and clean up test data. This makes tests faster and more reliable

- Login once and reuse  
  Login is done once per worker and auth state is saved. Other tests reuse this state instead of logging in every time. This reduces flakiness and speeds up execution

- Unique test data for every run  
  Each test creates employees with unique names and IDs using timestamps and other values. This avoids conflicts when tests run in parallel or are retried

- Retries only in CI  
  Locally tests do not retry so I can see failures immediately. In CI I have a small retry count to avoid failing the pipeline due to small temporary issues

- Sharding and workers  
  In CI tests are split into shards and run on multiple runners. Each runner also uses multiple workers. This keeps total execution time low

- Tagging strategy  
  Tests are tagged so I can run specific sets
  - @smoke for most critical tests
  - @regression for bigger set
  - @e2e for full end to end flows
  - @rbac for role based access tests
  - @quarantine for known flaky tests

  Examples
  ```bash
  npm run smoke
  npm run regression
  npm run rbac
  npx playwright test --grep "@regression" --grep-invert "@quarantine"
  ```

## Flaky tests detection
Playwright shows a test as flaky if it fails first and then passes on retry. You can see this in the HTML report and in results.json if configured.

To check how flaky a test is
```bash
npx playwright test --repeat-each=20
```
Then see how many times each test fails. Tests that fail often can be moved to quarantine.

## Flaky tests fixing
To reduce flakiness I focus on
- Fixing the root cause
  - Use proper waits and let Playwright wait for elements
  - Avoid sharing test data between tests
  - Use stable locators like role, label, test-id
- Keeping tests independent
  - Each test creates its own data and cleans it up
  - No dependency on test execution order
- Reusing auth via storage state instead of logging in every time
- Using retries only as a safety net
- Moving repeatedly flaky tests to quarantine and running them separately

## CI pipeline
## CI pipeline
The CI workflow in .github/workflows/ci.yml does the following
1. On push to main or on pull requests it starts the e2e job
2. The e2e job installs Node, dependencies and Playwright then runs tests in parallel shards using secrets for credentials
3. After e2e finishes the perf job runs k6 performance tests
4. Test reports for Playwright and k6 are uploaded as artifacts so they can be downloaded and checked

Green CI run example
https://github.com/jeshin1407/ArulJeshin_pearlsoft-orangehrm/actions/runs/37640000589

CI run status

![CI green run](screenshot asset/ci-artifacts2.png)

CI artifacts

![CI artifacts](screenshot asset/ci-artifacts2.png)