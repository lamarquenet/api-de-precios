const config = require('../config');
const axios = require('axios');
const { loggers } = require('winston'); // this retrieves default all loggers configured in the logger middleware file
const logger = loggers.get('general-logger');
const sendMailTo = require('../lib/emailSender');
const emailTemplates = require('../config/emailTemplates')

//this endpoint might be use for testing purposes or for later implementation of a mail system on dashboard
const sendEmail = (req, res) =>{
  const mailOptions = emailTemplates.custom(req.body.email , req.body.subject, req.body.msg);

  sendMailTo(mailOptions, function(err,result){
    if(err){
      logger.warn(`Error sending email to ${mailOptions.to}. Error: `+err);
      //only for endpoint calls
      res.send({
        msg:err
      })
    }else{
      logger.info(`Email to: ${mailOptions.to} was successfully sent. Subject: ${mailOptions.subject}`);
      res.send({
        msg:result
      })
    }
  })
}

//recive the last month that was updated
const getInflation = (req, res) =>{
  if(req.params.month === "undefined"){
    const twelveMonthsAgo = new Date((new Date).setMonth((new Date).getMonth()-12));
    req.params.month = ("0" + (twelveMonthsAgo.getMonth())).slice(-2)+"-"+twelveMonthsAgo.getFullYear();
  }
  let monthsToDownload = [];
  if(req.params.month){
    const date = req.params.month.split("-");
    const lastMonth = parseInt(date[0]);
    const lastYear = parseInt(date[1]);
    const currentMonth = (new Date).getMonth();
    const currentYear = (new Date).getFullYear();
    if(currentYear - lastYear >= 1){
      //le agrego todos los meses que ya pasaron de este año
      for(let i=currentMonth; i > 0; i--){
        let monthToPush = i>=10? i: "0"+i;
        monthsToDownload.push(monthToPush+"-"+currentYear)
      }
      //agrego los mesees que faltan para completar 12
      let lastMonthToDownload = lastMonth > currentMonth? lastMonth: currentMonth;
      for(let i=12; i>lastMonthToDownload; i--){
        let monthToPush = i>=10? i: "0"+i;
        monthsToDownload.push(monthToPush+"-"+(currentYear-1))
      }
    }
    else{
      for(let i=currentMonth; i>lastMonth; i--){
        let monthToPush = i>=10? i: "0"+i;
        monthsToDownload.push(monthToPush+"-"+(currentYear))
      }
    }

    if(monthsToDownload.length > 0){
      const urlRequest = config.pricesApi.url+config.pricesApi.inflationUrl + monthsToDownload.join(",");
      axios.get(urlRequest)
        .then(result =>{
          res.json(result.data)
         })
        .catch(err =>{
          logger.warn(`Error getting the inflation data. Error: `+err);
          res.status(500).send(err)
        })
    }
    else{
      res.json({});
    }
  }
  else return null
}

module.exports = {
  sendEmail,
  getInflation
}