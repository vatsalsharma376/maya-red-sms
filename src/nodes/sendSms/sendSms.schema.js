const { Node, Schema, fields } = require("@mayahq/module-sdk");
const SmsAuth = require("../smsAuth/smsAuth.schema.js");
class SendSms extends Node {
  constructor(node, RED, opts) {
    super(node, RED, {
      ...opts,
      // masterKey: 'You can set this property to make the node fall back to this key if Maya does not provide one'
    });
  }

  static schema = new Schema({
    name: "send-sms",
    label: "send-sms",
    category: "Maya Red Sms",
    isConfig: false,
    fields: {
      // Whatever custom fields the node needs.
      SmsAuth: new fields.ConfigNode({ type: SmsAuth }),
      message: new fields.Typed({
        type: "str",
        allowedTypes: ["msg", "flow", "global"],
      }),
      to: new fields.Typed({
        type: "str",
        defaultVal: "",
        allowedTypes: ["msg", "flow", "global"],
      }),
    },
  });

  onInit() {
    // Do something on initialization of node
  }

  async onMessage(msg, vals) {
    // Handle the message. The returned value will
    // be sent as the message to any further nodes.
    this.setStatus("PROGRESS", "Sending SMS");
    const _this = this;
    const props = vals.SmsAuth;
    console.log(props.service,props.originator,vals.to,vals.message);
    if (props.service == "twilio") {
      try {
        const client = require("twilio")(props.accountSid, props.authToken);
        client.messages
          .create({
            body: vals.message,
            from: props.from,
            to: vals.to,
          })
          .then((message) => {
            console.log(message.sid);
            _this.setStatus("SUCCESS", "SMS sent successfully");
            _this.redNode.send(msg);
          })
          .catch((err) => {
            //console.log(err);
            _this.setStatus("ERROR", err.message);
            msg.__isError = true;
            msg.__error = err;
            _this.redNode.send(msg);
          });
      } catch (err) {
        _this.setStatus("ERROR", err.message);
        msg.__isError = true;
        msg.__error = err;
        _this.redNode.send(msg);
      }
    } else if (props.service == "messageBird") {
      try {
        const messageBird = require("messagebird")(props.accessKey);
        messageBird.messages.create(
          {
            originator: props.originator,
            recipients: [vals.to],
            body: vals.message,
          },
          function (err, response) {
            if (err) {
              _this.setStatus("ERROR", err.message);
              msg.__isError = true;
              msg.__error = err;
              _this.redNode.send(msg);
            } else {
              _this.setStatus("SUCCESS", "SMS sent successfully");
              _this.redNode.send(msg);
            }
          }
        );
      } catch (err) {
        _this.setStatus("ERROR", err.message);
        msg.__isError = true;
        msg.__error = err;
        _this.redNode.send(msg);
      }
    } else if (props.service == "plivo") {
      try {
        const plivo = require("plivo");
        const client = new plivo.Client(props.authId, props.auth_token);
        client.messages
          .create({src: props.phone, dst: vals.to, text: vals.message})
          .then((response) => {
            _this.setStatus("SUCCESS", "SMS sent successfully");
            _this.redNode.send(msg);
          })
          .catch((error) => {
            _this.setStatus("ERROR", error.message);
            msg.__isError = true;
            msg.__error = error;
            _this.redNode.send(msg);
          });
      } catch (err) {
        _this.setStatus("ERROR", err.message);
        msg.__isError = true;
        msg.__error = err;
        _this.redNode.send(msg);
      }
    }
    // this.redNode.send(msg);
  }
}

module.exports = SendSms;
