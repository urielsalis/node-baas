var BaasClient = require('./pool');

BAAS_HOST=process.env.BAAS_HOST || 'localhost';
BAAS_PORT=process.env.BAAS_PORT || 39485;
BAAS_ITERATIONS=process.env.BAAS_ITERATIONS || 40;

var baas = new BaasClient({
  port: BAAS_PORT,
  host: BAAS_HOST,
  protocol: 'baass',
  rejectUnauthorized: false,
  pool: {
    maxConnections: 20,
    maxRequestsPerConnection: 10,
  }
});

function hash(i) {
  let plain = `plainTextPassword${i}`;
  return new Promise((resolve, reject) => {
    baas.hash(plain, (err,hash) => {
      if (err)
        reject(err);
      else
        resolve(hash);
    });
  }).then(hash => {
    return new Promise((resolve, reject) => {
      baas.compare(plain, hash, (err, success) => {
        if (err)
          reject(err);
        else if (!success)
          reject('expected hashes to match!');
        else
          resolve();
      });
    });
  });
}

const HASH_COUNT=BAAS_ITERATIONS;

let promises = [];
let errorCount = 0
let successCount = 0;

for(let i=0; i<HASH_COUNT; i++) {
  var p = hash(i);
  promises.push(p);
  p.then(() => {successCount++}).catch(() => { errorCount++; });
}

console.log('Starting test...');
Promise.all(promises).then(() => {
  console.log(`success:\t${successCount}\nerrors:\t\t${errorCount}`);

  process.exit(0);
}).catch(reason => {
  console.error(reason);
  process.exit(1);
});
