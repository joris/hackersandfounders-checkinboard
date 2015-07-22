angular.module('board.data', [])

  .constant('Config', {
    baseUrl: 'http://building.hackersandfounders.nl/api/v1/'
    //baseUrl: 'http://building.10.0.7.158.xip.io/api/v1/'
  })

  .factory('Data', function($http, $q, Config) {

    function getPresenceList() {
      return $http.get(Config.baseUrl + 'presence').then(function(r) {
        return r.data.people;
      });
    }

    function calculateBoardState(people) {
      // filter out unknown people
      people = _.filter(people, function(p) {
        return p.room !== null && p.tags.length > 0; });
      
      // calculate per-person's presence state
      var states = _(people)
        .map(
        function(p) {
          var unsureFlag = false;

          // get most recent tag
          var tag = _(p.tags).sort('updated_at').last();
          var ts = moment(tag.updated_at);
          var delta = moment().diff(ts, 'seconds');

          if (delta > 3600*12) {
            unsureFlag = true;
          }
          var checkinState = tag.status == 'present' ? 'in' : 'out';

          return {
            person: p,
            room: p.room,
            date: moment(tag.updated_at),
            state: checkinState,
            unsure: unsureFlag,
            time: ts.format("HH:mm")
          };
        })
        .sort('date')
        .reverse()
        .value();

      var roomData = _(states)
        .groupBy('room')
        .mapValues(function(v) {
          var inCount = _(v).filter({state:'in'}).value().length;
          return {
            total: v.length,
            'in': inCount,
            state: inCount > 0 ? 'inhabited' : 'deserted'
          };
        })
        .value();
      
      var recent = _(states).reject('unsure').slice(0,8).value();
      console.log('x', recent);

      return {
        people: {
          'in': _.filter(states, {state: 'in'}).length,
          'out': _.filter(states, {state: 'out'}).length
        },
        rooms: roomData,
        recent: recent,
        unsure: _(states).filter('unsure').map('person').slice(0,8).value()
      };
    }
    
    return {
      getPresenceList: getPresenceList,
      getBoardState: function() {
        return getPresenceList().then(function(people) {
          return calculateBoardState(people);
          return {
            people: {
              'in': 45,
              out: 43,
            },
            rooms: {
              "1.1": {
                'in': 3,
                'total': 10,
                state: 'inhabited'	
              }
            },
            recent: [
              {type: 'in',
               name: 'Arjan Scherpenisse',
               time: '9:14'},
              {type: 'out',
               name: 'Eric Holm',
               time: '9:34'}
            ],
            unsure: [
              {type: 'in',
               name: 'Arjan Scherpenisse',
               time: '9:14'},
              {type: 'out',
               name: 'Eric Holm',
               time: '9:34'}
            ]
          };
        });
      }
    };
  })

;
