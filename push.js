const webpush = require('webpush');

webpush.setGCMAPIKey(process.env.GCM_API_KEY);
webpush.setValidDetails(
  'y.wizowoz@gmail.com',
  process.env.VALID_KEY_PUBLIC,
  process.env.VALID_KEY_PRIVATE
);

function getSubscriptions() {

}

const Push = {
  sendNotification: function(payload) {
    subscriptions = getSubscriptions();
    for (let i=0;i<subscriptions.length;i++) {
      webpush.sendNotification(subscriptions[i], payload);
    }
  }
};

module.export = Push;
