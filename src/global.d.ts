declare module 'jest-allure2-reporter/api' {
  export const allure: {
    attachment(name: string, content: Buffer | string, type: string): void;
    step(name: string, status?: string): void;
    label(name: string, value: string): void;
    [key: string]: any;
  };
  export const ContentType: Record<string, string>;
}