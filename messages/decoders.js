const messages = require('./.');
const through2 = require('through2');
const protobuf = require('protobufjs');

function decoder(Message) {
    let buff;
    return through2.obj(function(chunk, enc, callback) {
        var chunk = protobuf.util.Buffer.from(chunk);
        buff = buff ? protobuf.util.Buffer.concat([buff, chunk]) : chunk;
        var reader = protobuf.Reader.create(buff);
        var decoded;
        while (reader.pos < reader.len) {
            try {
                decoded = Message.decodeDelimited(reader);
            } catch (err) {
                this.emit('error', err);
            }
            if (!decoded) {
                break;
            }
            this.push(decoded);
        }
        buff = buff.slice(reader.pos);
        callback();
    });
}

function buildDecoder(Message) {
  return decoder(Message);
}

Object.keys(messages).forEach(function (k) {
  module.exports[k + 'Decoder'] = function () {
    return buildDecoder(messages[k]);
  };
});
