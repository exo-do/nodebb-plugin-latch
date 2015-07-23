"use strict";

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');
var SocketPlugins = module.parent.require('./socket.io/plugins');
var Latch = require('./latchsdk/index.js');
var winston = module.parent.require('winston');

// PUT YOUR APP KEYS HERE! (Get it on https://latch.elevenpaths.com/)
var SECRETKEY = "";
var APPID = "";

var plugin = {};

plugin.getAuth = function(object, callback)
{
  //console.log(object);
  callback(null, object);
};


SocketPlugins.latchPairRequest = function (socket, data, callback) {
  if (!APPID || !SECRETKEY) {
    return winston.warn('[latch] APPID and SECRETKEY not set');
  }

    // El usuario que hace la peticion me viene en socket.uid
    
    Latch.init({ appId: APPID, secretKey: SECRETKEY });
    Latch.pair(data.latchcode, function(err, response){
      // Despues de parear veo si se ha realizado correctamente
      if(response.error)
      {
        callback(response, null);
        //console.log(err);
      }
      else
      {
        //callback(null, response);
        //console.log(response);
        User.setUserField(socket.uid, "latchId", response.data.accountId, function(err, result){
          callback(err, result);
        });
      }
    });
};

SocketPlugins.latchUnPairRequest = function (socket, data, callback) {
  if (!APPID || !SECRETKEY) {
    return winston.warn('[latch] APPID and SECRETKEY not set');
  }

  Latch.init({ appId: APPID, secretKey: SECRETKEY });
  User.getUserField(socket.uid, "latchId", function(err, userData){
    //console.log(userData);
    Latch.unpair(userData, function(err, response){
      // Despues de parear veo si se ha realizado correctamente
      if(response.error)
      {
        callback(response, null);
        //console.log(err);
      }
      else
      {
        //console.log(response);
        User.setUserField(socket.uid, "latchId", null, function(err, result){
          callback(err, result);
        });
      }
    });
  });
};


SocketPlugins.latchStatus = function (socket, data, callback) {
  if (!APPID || !SECRETKEY) {
    return winston.warn('[latch] APPID and SECRETKEY not set');
  }

  Latch.init({ appId: APPID, secretKey: SECRETKEY });
  User.getUserField(socket.uid, "latchId", function(err, userData){
    //console.log(userData);
    Latch.status(userData, function(err, response){
      // Despues de parear veo si se ha realizado correctamente
      if(!response.error)
        callback(err, response.data.operations[APPID].status);
      else
        callback(err, "on");
    });
  });
};

module.exports = plugin;
