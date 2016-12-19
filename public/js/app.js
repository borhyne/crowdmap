angular.module("contactsApp", ['ngRoute','ui-leaflet'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/list", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Contacts1) {
                        return Contacts1.getContacts();
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
    .service("Contacts1", function($http) {
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
    .controller('MarkersSimpleController', function ($scope, $location, $http, Contacts1) {
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

        var testing = {
            "_id": {
                "$oid": "5855fa53942137001165e01c"
            },
                "marker": {
                    "lat": 37.7798,
                    "lng": -122.43598,
                    "placename": "test",
                    "message": "Drag me to add point!",
                    "focus": true,
                    "draggable": true,
                    "description": "test",
                    "url": "test",
                    "entryname": "test",
                    "time": "test"
                }
            };

        $http.get('/contacts').
            success(function(contact, status, headers, config) {
                $scope.posts = data;
            }).
            error(function(contact, status, headers, config) {
            alert("problem");
        });

        angular.extend($scope, {
            sanfran: {
                lat: 37.77,
                lng: -122.44,
                zoom: 12
            },
            markers: testing,
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
    })

    .controller("EditContactController", function($scope, $routeParams, Contacts1) {
        Contacts1.getContact($routeParams.contactId).then(function(doc) {
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
            Contacts1.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.deleteContact = function(contactId) {
            Contacts1.deleteContact(contactId);
        }
    });