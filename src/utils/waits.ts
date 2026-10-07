import { expect } from '@playwright/test';

export async function pollUntil<T>(fn: () => Promise<T>, check: (v: T) => boolean) {
  await expect.poll(fn, { timeout: 15_000, intervals: [500, 1000, 2000] }).toSatisfy(check);
}