import { BasePage } from './BasePage';

export class AddEmployeePage extends BasePage {
  async goto() { await this.page.goto('/web/index.php/pim/addEmployee'); }

  async create(e: { first: string; middle?: string; last: string; id: string }) {
    await this.page.getByPlaceholder('First Name').fill(e.first);
    if (e.middle) await this.page.getByPlaceholder('Middle Name').fill(e.middle);
    await this.page.getByPlaceholder('Last Name').fill(e.last);
    await this.field('Employee Id').fill(e.id);
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForURL(/viewPersonalDetails\/empNumber\/\d+/);
    return Number(this.page.url().match(/empNumber\/(\d+)/)![1]);
  }
}