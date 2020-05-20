const fetch = require('node-fetch');
const moment = require('moment');

const webhookURL = process.env.WATCHMEN_GOOGLECHAT_WEBHOOKURL;


const sendMessage = (txt) => {
    var data = JSON.stringify({
        'text': txt,
    });
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: data,
    }).then((response) => {
        console.log(response);
    });
};

var eventHandlers = {

    /**
     * On a new outage
     * @param {Object} service
     * @param {Object} outage
     * @param {Object} outage.error check error
     * @param {number} outage.timestamp outage timestamp
     */

    onNewOutage: function (service, outage) {
        var errorMsg = service.name + ' down! (' + outage.error + ')';
        sendMessage(errorMsg);
    },


    /**
     * Service is back online
     * @param {Object} service
     * @param {Object} lastOutage
     * @param {Object} lastOutage.error
     * @param {number} lastOutage.timestamp (ms)
     */

    onServiceBack: function (service, lastOutage) {
        var duration = moment.duration(+new Date() - lastOutage.timestamp);
        var msg = service.name + ' is back' + '. Down for ' + duration.humanize();
        sendMessage(msg);
    },

};

function GoogleChatPlugin(watchmen) {
    watchmen.on('new-outage', eventHandlers.onNewOutage);
    watchmen.on('service-back', eventHandlers.onServiceBack);
}

exports = module.exports = GoogleChatPlugin;