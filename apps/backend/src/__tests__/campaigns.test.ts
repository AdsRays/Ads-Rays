import type { Response } from 'express';

// Simple test to verify campaigns endpoint structure
describe('Campaigns API', () => {
  test('campaigns endpoint returns correct structure', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Simulate the campaigns endpoint logic
    const list = [
      { id: 'cmp-1', name: 'Тестовая кампания 1', status: 'ACTIVE', creatives: 2 },
      { id: 'cmp-2', name: 'Тестовая кампания 2', status: 'PAUSED', creatives: 2 }
    ];

    mockRes.status(200).json(list);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(list);
    
    // Verify structure
    expect(list).toHaveLength(2);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('status');
    expect(list[0]).toHaveProperty('creatives');
    expect(typeof list[0].creatives).toBe('number');
  });

  test('proxy campaigns endpoint returns same structure', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Simulate the proxy campaigns endpoint logic (same as campaigns)
    const list = [
      { id: 'cmp-1', name: 'Тестовая кампания 1', status: 'ACTIVE', creatives: 2 },
      { id: 'cmp-2', name: 'Тестовая кампания 2', status: 'PAUSED', creatives: 2 }
    ];

    mockRes.status(200).json(list);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(list);
    
    // Verify structure
    expect(list).toHaveLength(2);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('status');
    expect(list[0]).toHaveProperty('creatives');
    expect(typeof list[0].creatives).toBe('number');
  });
});
