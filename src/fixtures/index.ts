import { test as base } from '@playwright/test';
import { EmployeeApi } from '../api/EmployeeApi';
import { PimPage } from '../pages/PimPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeDetailsPage } from '../pages/EmployeeDetailsPage';

type Fixtures = {
  employeeApi: EmployeeApi;
  pim: PimPage;
  addEmployee: AddEmployeePage;
  details: EmployeeDetailsPage;
};

export const test = base.extend<Fixtures>({
  employeeApi: async ({ request }, use) => use(new EmployeeApi(request)),
  pim: async ({ page }, use) => use(new PimPage(page)),
  addEmployee: async ({ page }, use) => use(new AddEmployeePage(page)),
  details: async ({ page }, use) => use(new EmployeeDetailsPage(page)),
});
export { expect } from '@playwright/test';