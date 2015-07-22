angular.module('board', [
  'ui.bootstrap',
  'ui.router',

  // compiled templates
  'templates',

  // modules
  'board.data',
])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('board', {
        url: "/board",
        controller: 'BoardController',
        templateUrl: "/views/board.html"
      })
    
    ;
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/board');

  })

  .controller('BoardController', function($scope, Data) {

    $scope.allRooms = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];
    
    Data.getBoardState().then(function(state) {
      $scope.state = state; //$scope.$broadcast('boardstate', state);
    });

  })

;
