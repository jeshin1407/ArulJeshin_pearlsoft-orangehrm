import { test, expect } from '../../src/fixtures';
import { newEmployee } from '../../src/utils/dataFactory';

test.describe('Employee lifecycle', () => {
  test('create, update, verify via API, delete @smoke @regression @e2e',
    async ({ addEmployee, details, pim, employeeApi, page }) => {
      const emp = newEmployee();
      let empNumber = 0;

      try {
        await test.step('create employee via UI', async () => {
          await addEmployee.goto();
          empNumber = await addEmployee.create(emp);
        });

        await test.step('verify created record via API', async () => {
          const res = await employeeApi.get(empNumber);
          expect(res.status()).toBe(200);
          const body = (await res.json()).data;
          expect(body.firstName).toBe(emp.first);
          expect(body.lastName).toBe(emp.last);
        });

        await test.step('update employee via UI', async () => {
          await details.updateName(`${emp.first}Upd`, `${emp.last}Upd`);
          await page.reload();
          await details.expectName(`${emp.first}Upd`, `${emp.last}Upd`);
        });

        await test.step('verify update via API', async () => {
          const body = (await (await employeeApi.get(empNumber)).json()).data;
          expect(body.firstName).toBe(`${emp.first}Upd`);
        });

        await test.step('delete employee via UI', async () => {
          await pim.goto();
          await pim.searchById(emp.id);
          await pim.deleteById(emp.id);
        });

        await test.step('verify deletion via UI and API', async () => {
          await pim.searchById(emp.id);
          await pim.expectNotListed(emp.id);
          const res = await employeeApi.get(empNumber);
if (res.status() === 200) {
  expect((await res.json()).data).toBeNull();
} else {
  expect([404, 422]).toContain(res.status());
}
        });
        empNumber = 0;
      } finally {
        if (empNumber) await employeeApi.delete(empNumber);
      }
    });
});