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
            .when("/portland", {
                controller: "MarkersSimpleController",
                templateUrl: "portland.html"
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
                    /*alert("Error creating contact.");*/
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
    .controller('MarkersSimpleController', [ '$scope', '$location', '$http', 'Contacts', function ($scope, $location, $http, Contacts) {
        $scope.back = function() {
            $location.path("#/contact");
        }

        $scope.saveContact = function(contact) {
            Contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path("#/list");
            }, function(response) {
                alert(response);
            });
        }

        $scope.help = []
            $http.get('/contacts').success(function(data) {
                for (var i = 0; i < data.length; i++){
                    $scope.help.push({
                        lat: data[i].marker.lat,
                        lng: data[i].marker.lng,
                        message: "<a href=#/contact/"+data[i]._id+">"+data[i].marker.placename+"</a>",
                        draggable: data[i].draggable,
                        focus: data[i].focus
                    })
                }
            });


        $scope.$on("centerUrlHash", function(event, centerHash) {
            console.log("url", centerHash);
            $location.search({ c: centerHash });
            // need to add function here to take centerHash and convert it to a marker
        });

        $scope.changeLocation = function(centerHash) {
            $location.search({ c: centerHash });
        };

        $scope.list = [];
        $scope.text = '';
        $scope.submit = function() {
            if ($scope.text) {
                $scope.list.push(this.text);
                $scope.bounds.address = $scope.text;
                $scope.text = '';
            }
        };

        angular.extend($scope, {
            sanfran: {
                lat: 37.7360,
                lng: -122.3987,
                zoom: 10
            },
            bounds: {
                address: 'San Francisco, CA'
            },
            portland: {
                lat: 45.5425,
                lng: -122.7945,
                message: "come to portland",
                focus: false,
                draggable: false
            },
            position: {
                lat: 37.77,
                lng: -140.435
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