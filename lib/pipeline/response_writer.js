const ResponseMessage = require('../../messages').Response;
const through2 = require('through2');
const xtend = require('xtend');

var defaults = {
    ignore_invalid: false
};

function encoder(Message, options) {
    options = xtend(defaults, options || {});
    return through2.obj(function(message, enc, callback) {
        if (Message.verify(message)) {
            if (options.ignore_invalid) {
                return this.queue(message);
            }
            throw new Error('unhandled request');
        }
        return callback(null, Message.encodeDelimited(message).finish());
    });
}

module.exports = function () {
  return encoder(ResponseMessage);
};
