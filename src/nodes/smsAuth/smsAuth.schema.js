const { Node, Schema, fields } = require("@mayahq/module-sdk");

class SmsAuth extends Node {
  constructor(node, RED, opts) {
    super(node, RED, {
      ...opts,
      // masterKey: 'You can set this property to make the node fall back to this key if Maya does not provide one'
    });
  }

  static schema = new Schema({
    name: "sms-auth",
    label: "sms-auth",
    category: "config",
    isConfig: true,
    fields: {
      // Whatever custom fields the node needs.
      service: new fields.SelectFieldSet({
        fieldSets: {
          twilio: {
            accountSid: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
            authToken: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
            from: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
          },
          messageBird: {
            accessKey: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
            originator: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
          },
          plivo: {
            authId: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
            auth_token: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
            phone: new fields.Typed({
              type: "str",
              defaultVal: "",
              allowedTypes: ["msg", "str", "flow", "global"],
            }),
          },
        },
      }),
    },
    redOpts: {
      credentials: {},
    },
  });

  onInit() {
    // Do something on initialization of node
  }

  async onMessage(msg, vals) {
    // Handle the message. The returned value will
    // be sent as the message to any further nodes.
  }
}

module.exports = SmsAuth;
