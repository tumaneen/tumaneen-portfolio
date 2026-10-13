import https from 'node:https';

const options = {
  hostname: 'www.behance.net',
  path: '/gallery/257004895/LUMERA-Brand-Identity-Packaging-Design',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  }
};

https.get(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('BODY LENGTH:', data.length);
    if (data.includes('429')) console.log('429 detected');
    const imgMatches = data.match(/https:\/\/[^"'\s<>]+?(?:\.jpg|\.png|\.webp)/gi);
    if (imgMatches) {
      console.log('Images found:', [...new Set(imgMatches)].slice(0, 15));
    }
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
