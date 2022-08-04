import { buildJWT } from 'utils/chain/buildJWT';

const forceDate = 444444444444; // Tue Jan 31 1984 17:47:24 GMT-0700 (Mountain Standard Time)
const masterKeyB64 =
  'xprvA2uK8NvW35LoM92g6teN1n2jNhCd7nXCLVTvTUhohqREx156LU4LF1jg59wpCRMHV4cbv4TBkXhJCHYFEGGi8LGXquWkdJH651Cz9Mr31uo';
const address = 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh';
const testData = [
  {
    expires: 454444444444, // Sat May 26 1984 12:34:04 GMT-0600 (Mountain Daylight Time)
    result:
      'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJBeDZMRTBGbE1VOXFNRllFT0pacEVYUTQ5SVBqYnNnQ3JrLzJraFE2VU03ayIsImlzcyI6InByb3ZlbmFuY2UuaW8iLCJpYXQiOjQ0NDQ0NDQ0NDQ0NCwiZXhwIjo0NTQ0NDQ0NDQ0NDQsImFkZHIiOiJ0cDFrbnN4Zm5uMGxxNDhtbW5rZm5rZ3Rrazhxbnh4ZHUweTJ0a2xraCJ9.pPKkEVixjEwrmRR9/JQVrAYyQknSajpA0WiQoWn5qHpWlPrLxMa9tBD6KGnSugx2u/lGXt/QFyd0ie1lu3F0dg==',
  },
  {
    result:
      'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJBeDZMRTBGbE1VOXFNRllFT0pacEVYUTQ5SVBqYnNnQ3JrLzJraFE2VU03ayIsImlzcyI6InByb3ZlbmFuY2UuaW8iLCJpYXQiOjQ0NDQ0NDQ0NDQ0NCwiZXhwIjo0NDQ0NDQ1MzA4NDQsImFkZHIiOiJ0cDFrbnN4Zm5uMGxxNDhtbW5rZm5rZ3Rrazhxbnh4ZHUweTJ0a2xraCJ9.yBw1hPlTBxCyTnnX4hTt17sxptuLfY0jspvKcgU2wW4KzXEd+fjQiAxGmWAQwH7lhT69utP0pYlFgBKUyd3BAw==',
  },
];

// ---------------------------------------------------------------
// Test resulting jwts to make sure they are properly created
// ---------------------------------------------------------------
describe('Create a list of valid signed jwts', () => {
  testData.forEach(({ expires, result }, index) => {
    test(`Creating signed jwt #${index + 1}`, () => {
      expect(buildJWT(masterKeyB64, address, expires, forceDate)).toBe(result);
    });
  });
});
