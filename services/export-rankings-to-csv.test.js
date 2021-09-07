const mock = require('mock-fs');
const { readFileSync } = require('fs');
const path = require('path');

const exportRankingsToCsv = require('./export-rankings-to-csv');

describe('export-rankings-to-csv.js', () => {
  let rankings, dateString, date;
  beforeAll(async () => {
    jest.resetAllMocks();

    date = new Date('2021-01-20');
    rankings = [
      {
        item: "Alfa's example",
        url: 'https://example.com',
        rank: 1,
        date: date,
      },
      { item: 'Beta', url: 'https://example.com', rank: 2, date: date },
    ];

    mock({
      [path.join(process.cwd(), 'export-csv')]: {
        /** empty directory */
      },
    });
  });

  describe('without dateString', () => {
    test('should write all rankings to csv file', async () => {
      const file = path.join(process.cwd(), 'export-csv', `export_all.csv`);

      const expectedResult = `Item,Item_clean,Item_no_spaces,Date,Rank,Url\n"Alfa's example",alfas example,alfasexample,2021-01-20,1,https://example.com\n"Beta",beta,beta,2021-01-20,2,https://example.com\n`;

      await exportRankingsToCsv(rankings);

      const result = readFileSync(file, 'utf8');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('with specified dateString', () => {
    beforeEach(() => {
      dateString = '2021-01-20';
    });

    test('should write all rankings to csv file', async () => {
      const file = path.join(
        process.cwd(),
        'export-csv',
        `export_${dateString}.csv`
      );

      const expectedResult = `Item,Item_clean,Item_no_spaces,Date,Rank,Url\n"Alfa's example",alfas example,alfasexample,2021-01-20,1,https://example.com\n"Beta",beta,beta,2021-01-20,2,https://example.com\n`;

      await exportRankingsToCsv(rankings, dateString);

      const result = readFileSync(file, 'utf8');

      expect(result).toEqual(expectedResult);
    });
  });

  afterAll(async () => {
    mock.restore();
  });
});
