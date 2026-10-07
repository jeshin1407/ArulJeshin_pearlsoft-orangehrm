import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  async goto() { await this.page.goto('/web/index.php/pim/viewEmployeeList'); }

  async searchById(id: string) {
    await this.field('Employee Id').fill(id);
    const listLoaded = this.page.waitForResponse(
      (r) => r.url().includes('/api/v2/pim/employees') && r.request().method() === 'GET'
    );
    await this.page.getByRole('button', { name: 'Search' }).click();
    await listLoaded;
    await this.waitForLoader();
  }

  // finds the row whose cell is exactly this Employee Id
  rowWithId(id: string) {
    return this.page
      .locator('.oxd-table-body .oxd-table-row')
      .filter({ has: this.page.getByText(id, { exact: true }) });
  }

  async deleteById(id: string) {
    const row = this.rowWithId(id);
    await expect(row).toHaveCount(1);
    await row.locator('button:has(.bi-trash)').click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await this.expectToast(/Successfully Deleted/);
  }

  async expectNotListed(id: string) {
    await expect(this.rowWithId(id)).toHaveCount(0);
  }
}