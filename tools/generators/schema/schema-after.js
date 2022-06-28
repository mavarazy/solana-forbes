const fs = require('fs');

const rootPath = 'libs/types/src/generated';

fs.readdir(rootPath, 'utf-8', function (err, files) {
  files.forEach((file) => {
    const filePath = `${rootPath}/${file}`;
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      const result = data
        .replace(
          /\/\/ This file was automatically generated and should not be edited./,
          '// This file was automatically generated and should not be edited.\n\nimport * as general from "../lib";'
        )
        .replace(/nft_marketplace_enum/g, 'NftMarketplace')
        .replace(/tokens: jsonb;/g, 'tokens: general.TokenWorthSummary;')
        .replace(/summary: jsonb;/g, 'summary: general.TokenSummary;')
        .replace(/numeric/g, 'general.numeric')
        .replace(/timestamptz/g, 'general.timestamptz')
        .replace(/: date;/g, ': general.date;')
        .replace(/: date \| null;/g, ': general.date | null;')
        .replace(/: uuid;/g, ': general.uuid;')
        .replace(/: uuid \| null;/g, ': general.uuid | null;')
        .replace(/jsonb/g, 'general.jsonb');
      fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  });
});
