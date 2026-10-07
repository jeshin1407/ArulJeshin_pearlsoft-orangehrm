import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeDetailsPage extends BasePage {
  async updateName(first: string, last: string) {
    await this.waitForLoader();

    const firstName = this.page.getByPlaceholder('First Name');
    const lastName = this.page.getByPlaceholder('Last Name');

    // wait until the form has loaded the existing data
    await expect(firstName).not.toHaveValue('');
    await expect(lastName).not.toHaveValue('');

    await firstName.fill(first);
    await lastName.fill(last);

    // make sure our text stayed in the fields
    await expect(firstName).toHaveValue(first);
    await expect(lastName).toHaveValue(last);

    // wait for the save request to finish
    const saved = this.page.waitForResponse(
      (r) => r.url().includes('personal-details') && r.request().method() === 'PUT'
    );
    await this.page.getByRole('button', { name: 'Save' }).first().click();
    await saved;

    await this.expectToast(/Successfully Updated/);
  }

  async expectName(first: string, last: string) {
    await expect(this.page.getByPlaceholder('First Name')).toHaveValue(first);
    await expect(this.page.getByPlaceholder('Last Name')).toHaveValue(last);
  }
}