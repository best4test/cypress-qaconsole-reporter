'use strict';

var moment = require("moment");

module.exports = MochaQAconsoleReporter;

function MochaQAconsoleReporter(runner, options) {
    this._runner = runner;
    this._options = options;
    var result = {};
    var count = 0;
    var url = options.reporterOptions.url;
    var apiKey = options.reporterOptions.apiKey;
    result.status = "passed";
    result.tests = [];
    result.projectName = options.reporterOptions.projectName;
    result.environment = options.reporterOptions.environment;

    this._runner.on('pass', function (test) {
        var ltest = {}
        ltest.id = "spec" + count;
        ltest.description = "";
        ltest.fullName = test.parent.title + " - " + test.title;
        ltest.failedExpectations = [];
        ltest.passedExpectations = [];
        ltest.status = "passed"
        ltest.duration = test.duration;
        ltest._endTime = moment().format('MMM Do YYYY, HH:mm (Z)');
        result.tests.push(ltest)
    });
    this._runner.on('fail', function (test) {
        result.status = "failed";
        var ltest = {}
        ltest.id = "spec" + count;
        ltest.description = "";
        ltest.fullName = test.parent.title + " - " + test.title;
        ltest.failedExpectations = [];
        var err = {}
        err.message = test.err.message
        ltest.failedExpectations.push(err)
        ltest.passedExpectations = [];
        ltest.status = "failed";
        ltest.duration = test.duration;
        ltest._endTime = moment().format('MMM Do YYYY, HH:mm (Z)');
        result.tests.push(ltest)
    });

    this._runner.on('end', function () {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'ApiKey '+apiKey
          }
          
        const axios = require('axios');
        axios.post(url+'/testruns',result,{
            headers: headers
          })
            .then((res) => {
                console.log('Body: ', res.data);
            }).catch((err) => {
                console.error(err);
            });
    }.bind(this));
}