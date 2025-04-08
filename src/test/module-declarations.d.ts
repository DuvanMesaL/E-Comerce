// This file contains type declarations that override the original module types
// to make TypeScript happy with our mocks

declare module 'mongodb' {
    // Simplified MongoDB types for testing
    export class MongoClient {
      connect(): Promise<any>;
      db(): any;
      close(): Promise<void>;
    }
  
    export interface Collection {
      insertOne(doc: any): Promise<any>;
      find(query: any): any;
      createIndex(keys: any): Promise<string>;
    }
  
    export interface Db {
      collection(name: string): Collection;
    }
  }
  
  declare module 'kafkajs' {
    // Simplified Kafka types for testing
    export class Kafka {
      constructor(config: any);
      producer(): Producer;
      consumer(config: any): Consumer;
    }
  
    export interface Producer {
      connect(): Promise<void>;
      send(message: any): Promise<any>;
      disconnect(): Promise<void>;
    }
  
    export interface Consumer {
      connect(): Promise<void>;
      subscribe(options: any): Promise<void>;
      run(options: any): Promise<void>;
    }
  }
  
  // Override Jest's mock types to avoid 'never' type errors
  declare namespace jest {
    interface MockInstance<T = any, Y extends any[] = any[]> {
      mockResolvedValue(value: any): this;
      mockReturnValue(value: any): this;
      mockImplementation(fn: (...args: any[]) => any): this;
    }
  }
  