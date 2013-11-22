var models = require('../common/models.js')();
var validate = require('../common/validate.js');
var async = require('async');

// forms.getSubmissions({"uri": mongoUrl}, {"appId" : req.params.appId, "formId": req.params.formId}, function(err, results){
module.exports = function getSubmissionList(connections, options, params, cb) {
  var formSubmissionModelModel = models.get(connections.mongooseConnection, models.MODELNAMES.FORM_SUBMISSION);
  var fieldModel = models.get(connections.mongooseConnection, models.MODELNAMES.FIELD);

  var query = {
    "status": "complete"
  };
  if (params.appId) {
    query.appId = params.appId;
  }
  if (params.formId) {
    query.formId = params.formId;
  }

  formSubmissionModel
    .find(query)
    .populate({"path": "formFields.fieldId", "model": fieldModel, "select": "-__v"})
    .populate({"path": "formFields.fieldValues"})
    .exec(function(err, foundSubmissions){
      if(err) return cb(err);
      var retSubmissions = foundSubmissions;

      if (retSubmissions === null) {
        retSubmissions = [];
      }

      return cb(err, retSubmissions);
    });
  });
};