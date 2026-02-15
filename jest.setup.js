import '@testing-library/jest-dom'

// Mock fetch and Response globally for Firebase
global.fetch = jest.fn();
global.Response = jest.fn();
global.Request = jest.fn();
global.Headers = jest.fn();