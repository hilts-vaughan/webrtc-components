/**
 * Provides a named list adapter for data.
 */
export class NameList {
  names = ['Software Engineering #1', 'Software Engineering #2'];
  get(): string[] {
    return this.names;    
  }
  add(value: string): void {
    this.names.push(value);
  }
}
