(function () {
    'use strict';

    var app = angular.module('app', [
        'SignalR'
    ]);

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }

    app.value('messages', []);

    app.factory('messageService', ['$rootScope', 'Hub', 'messages',
        function messageService($rootScope, Hub, messages) {

             var hub = new Hub('chatHub', {

                 //client side methods
                 listeners: {
                     'broadcastMessage': function (author, message) {
                         messages.push({ author: author, body: message });
                         $rootScope.$apply();
                     }                     
                 },

                 //server side methods
                 methods: ['send'],

                 //handle connection error
                 errorHandler: function (error) {
                     console.error(error);
                 },
               
             });

             var sendMessage = function (author, message) {
                 hub.send(author, message); //Calling a server method
             };

             return {
                 sendMessage: sendMessage,
             };

         }
    ]);

    app.controller('chatCtrl', ['messageService','messages',

        function chatCtrl(messageService, messages) {

            var vm = this;

            //model
            vm.message = '';
            vm.name = '';
            vm.messages = messages;

            //functions
            vm.send = function send() {
                messageService.sendMessage(vm.name, vm.message);
                vm.message = '';
            };

        }
    ]);

})();