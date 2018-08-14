const protobuf = require('protobufjs');
const path = require('path');

const root = new protobuf.Root();
root.loadSync(path.join(__dirname, '/../protocol/Index.proto'), {keepCase: true});

module.exports = {
  Request: root.lookupType('baas.Request'),
  Response: root.lookupType('baas.Response'),
};
