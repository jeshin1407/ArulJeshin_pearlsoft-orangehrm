import { randomUUID } from 'crypto';

export function newEmployee() {
  const suffix = randomUUID().slice(0, 6);
  return {
    first: 'Arul Jeshin',
    middle: 'QA',
    last: 'A',
    id: String(Math.floor(10000 + Math.random() * 89999)),
  };
}