angular.module("contactsApp", ['ngRoute','ui-leaflet'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/list", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Contacts) {
                        return Contacts.getContacts();
                    }
                }
            })
            .when("/new/contact", {
                controller: "MarkersSimpleController",
                templateUrl: "map.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "contact.html"
            })
            .when("/", {
                controller: "MarkersSimpleController",
                templateUrl: "map.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/contacts").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
        }
        this.createContact = function(contact) {
            return $http.post("/contacts", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;
    })    
    .controller('MarkersSimpleController', ['$scope','$location', 'Contacts', function ($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/contact");
        }

        $scope.saveContact = function(contact) {
            contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);
            }, function(response) {
                alert(response);
            });
        }

        var wtf = "need a break"
        alert(contact);

        var comeon =
        {
            "marker":{
                "lat": 37.82632787689904,
                "lng": -122.42271423339842,
                "placename": "Alcatraz",
                "description": "A must as a SF tourist. Make sure to get your tickets in advance",
                "url": "http://www.history.com/topics/alcatraz",
                "entryname": "Bo",
                "time": "4",
                "message": "Drag me to add point!",
                "focus" : true,
                "draggable": false
            },
            "marker1":{
                "lat": 37.81065700886835,
                "lng": -122.47654080390929,
                "message": "Drag me to add point!",
                "focus" : true,
                "draggable": true,
                "placename": "Golden Gate Surfing",
                "description": "Watch people surfing under the golden gate bridge!",
                "url": "http://adventureblog.nationalgeographic.com/2016/01/19/surfing-under-the-golden-gate-bridge/",
                "entryname": "Bo",
                "time": "2"}
            };

        angular.extend($scope, {
            sanfran: {
                lat: 37.77,
                lng: -122.44,
                zoom: 12
            },
            markers: comeon,
            position: {
                lat: 37.77,
                lng: -122.435
            },
            events: { // or just {} //all events
                markers:{
                    enable: [ 'dragend' ]
                      //logic: 'emit'
                }
            }
        });

        $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
            $scope.position.lat = args.model.lat;
            $scope.position.lng = args.model.lng;
        });
    }])

    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function(doc) {
            $scope.contact = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "map.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.saveContact = function(contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.deleteContact = function(contactId) {
            Contacts.deleteContact(contactId);
        }
    });