/**
 * Provides a set of streams encapuslated into a list.
 */
export class StreamList {
  streams = [];
  
  get(): string[] {
    return this.streams;    
  }
  add(value: string): void {
    this.streams.push(value);
  }
}
