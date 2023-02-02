import { jest } from '@jest/globals';

global.console = {
  log: jest.fn(),
  debug: jest.fn(),
};
