let my_collections_app = angular.module('appCollectionsCtrl', ['appConfigCtrl']);

/* route: /collection/new */
my_collections_app.controller(
    'newCollectionCtrl',
    function($http, $scope, $window, $location){
        let base_url = $scope.$parent.base_url;
        let request = {
            method: 'GET',
            url: base_url + "/metrics.json",
            headers: {
                'Accept': "application/json",
            },
            data: null
        };

        $scope.available_metrics = {};
        $scope.collection_data = {};
        $scope.collection_data.name = "";
        $scope.collection_data.contact = "";
        $scope.collection_data.organization = "";
        $scope.collection_data.indicators = [];
        $scope.collection_data.description = "";
        $scope.triggered = false;
        $scope.errors = false;
        $scope.response_content = false;


        $http(request).then(function(response){
            $scope.available_metrics = response.data;
        });

        $scope.createCollection = function(){

            $scope.triggered = true;

            let request_data = {
                "name": $scope.collection_data.name,
                "contact": $scope.collection_data.contact,
                "description": $scope.collection_data.description,
                "organization": $scope.collection_data.organization,
                "include_metrics": []
            };

            for (let ite in $scope.collection_data.indicators){
                let metric_URL = $scope.collection_data.indicators[ite];
                for (let sub_it in $scope.available_metrics){
                    if ($scope.available_metrics.hasOwnProperty(sub_it) && $scope.available_metrics[sub_it]["@id"] === metric_URL){
                        request_data['include_metrics'].push($scope.available_metrics[sub_it]['smarturl']);
                    }
                }
            }

            let request = {
                method: 'POST',
                url: base_url + "/collections",
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                data: request_data
            };

            $http(request).then(function(response){
                $scope.triggered = false;
                console.log(response);
                let identifier= response.data['@id'].split('/').slice(-1)[0];
                let root_url = new $window.URL($location.absUrl());
                $scope.response_content = root_url.origin + root_url.pathname + "#!/collections/" + identifier;
                $scope.errors = response.data.statusText
            });
        };

        $scope.clearFields = function(){
            $scope.collection_data.name = "";
            $scope.collection_data.contact = "";
            $scope.collection_data.organization = "";
            $scope.collection_data.indicators = [];
            $scope.collection_data.description = "";
        }

    }

);