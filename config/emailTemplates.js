exports.verification = (email , userVerString = "", redirectTo ='/', redirectOnFail = '/')=> ({
  from: 'apideprecios@gmail.com', // sender
  to: email, // receiver
  subject: 'Confirm mail account to finish registering', // Subject
  html: '<p>To confirm your account registration with apideprecios.com.ar por favor clickea en el siguiente link: ' +
    "<a href=\"http://localhost:5000/users/confirmRegister?confirmCode="+userVerString+"&redirectOnFail="+redirectOnFail+"&redirectTo="+redirectTo+"\">Confirmar Registro</a></p>"// html body
});

exports.custom = (email , subject = "", msg = "")=> ({
  from: 'apideprecios@gmail.com', // sender
  to: email, // receiver
  subject: subject, // Subject
  html: '<p> msg </p>'// html body
});