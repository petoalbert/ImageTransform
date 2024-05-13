import { kMeans } from '../src/kmeans';

describe('kmeans', () => {
  it('should return the correct result', () => {
    const data = [[1], [2], [3], [100], [101], [102]];
    const k = 2;

    const result = kMeans(data, k);

    expect(result).toEqual(expect.arrayContaining([[2], [101]]));
  });
});