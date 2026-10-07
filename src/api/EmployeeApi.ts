import { APIRequestContext, expect } from '@playwright/test';

export class EmployeeApi {
  constructor(private request: APIRequestContext) {}
  private base = '/web/index.php/api/v2/pim/employees';

  async get(empNumber: number) {
    return this.request.get(`${this.base}/${empNumber}`);
  }

  async create(data: { firstName: string; lastName: string; employeeId: string }) {
    const res = await this.request.post(this.base, {
      data: { ...data, middleName: '', empPicture: null },
    });
    expect(res.ok()).toBeTruthy();
    return (await res.json()).data.empNumber as number;
  }

  async delete(empNumber: number) {
    return this.request.delete(this.base, { data: { ids: [empNumber] } });
  }
}