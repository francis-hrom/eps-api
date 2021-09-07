const mock = require('mock-fs');
const mongoose = require('mongoose');
const { readFileSync } = require('fs');
const path = require('path');

const exportOverviewToCsv = require('./export-overview-to-csv');
const Ranking = require('../models/ranking');

describe('export-overview-to-csv.js', () => {
  let dateString, date, rankingData;
  beforeAll(async () => {
    jest.resetAllMocks();

    date = new Date('2021-01-20');
    rankingsData = [
      {
        item: 'Nokia XYZ',
        url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
        rank: 1,
        date: date,
      },
      {
        item: 'Samsung Galaxy',
        url: 'https://webscraper.io/test-sites/e-commerce/allinone/phones/touch',
        rank: 2,
        date: date,
      },
    ];

    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    mock({
      [path.join(process.cwd(), 'export-csv')]: {
        /** empty directory */
      },
    });
  });

  describe('when there are rankings', () => {
    beforeEach(async () => {
      dateString = '2021-01-20';

      await Promise.all(
        rankingsData.map(async (ranking) => {
          const newRanking = new Ranking(ranking);
          await newRanking.save();
        })
      );
    });

    test('should write rankings to csv file', async () => {
      const file = path.join(
        process.cwd(),
        'export-csv',
        `export_${dateString}_overview.csv`
      );

      const expectedResult = `Url,Date,Rankings\n${rankingsData[0].url},${dateString},${rankingsData.length}\n`;

      await exportOverviewToCsv(dateString);

      const result = readFileSync(file, 'utf8');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('when there are no rankings', () => {
    beforeEach(() => {
      dateString = '2021-01-21';
    });

    test('should write no rankings to csv file', async () => {
      const file = path.join(
        process.cwd(),
        'export-csv',
        `export_${dateString}_overview.csv`
      );
      const expectedResult = `Url,Date,Rankings\n`;

      await exportOverviewToCsv(dateString);

      const result = readFileSync(file, 'utf8');
      expect(result).toEqual(expectedResult);
    });
  });

  afterAll(async () => {
    mock.restore();
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});
