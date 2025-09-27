import { forecast } from '../services/demoService';

test('forecast returns numbers', async () => {
  const r = await forecast({ budget: 1000, audience: 'retarget', time: '08:00-20:00', bid: 50, format: 'reels' });
  expect(r.orders).toBeGreaterThanOrEqual(0);
});



