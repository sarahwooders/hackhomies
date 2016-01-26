Router.configure({
    //layoutTemplate: 'layout'
  });

Router.map(function () {
  this.route('index', {
    path: '/',
    template: 'index',
  });

  this.route('createProfile', {
    path: '/profile',
    template: 'createProfile',
    layoutTemplate: 'layout'
  });

  // this.route('teams', {
  //   path: '/teams',
  //   template: 'teams',
  //   layoutTemplate: 'layout'
  // });

  this.route('recommended', {
    path: '/recommended',
    template: 'recommended',
    layoutTemplate: 'layout'
  });

  this.route('browse', {
    path: '/browse',
    template: 'browse',
    layoutTemplate: 'layout',
  });

  this.route('requests', {
    path: '/requests',
    template: 'requests',
    layoutTemplate: 'layout'
  })

  // this.route(':id', {
  //   path: '/users/:id/team',
  //   layoutTemplate: 'layout'
  // })

});

Router.route('/users/:_id/team', function() {
  this.layout('layout');
  this.render('teams', {
    data: {
      targetID: this.params._id
    }, 
  });
});

Router.route('/teams', function () {
  this.layout('layout');
  this.render('teams', {
    data: {
      targetID: Meteor.userId()
    }
  })
});

Router.route('/search', function () {
  this.layout('layout');
  this.render('searchBox', {
    
  })
});


var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('index');
  } else {
    this.next();
  }
};

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    if(Profiles.findOne({_id: Meteor.userId()})){
      Router.go('browse');
    } else {
      Router.go('createProfile');
    }
  } else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['index']});
Router.onBeforeAction(goToDashboard, {only: ['index']});

// Router.route('/users/:_id', function() {
// 	var _id = this.params._id;
// 	this.render('fullProfile', {
// 		data: function () {
// 			return Profiles.findOne(_id);
// 		}
// 	});
// });

Router.route('/users/:_id', function() {
 var _id = this.params._id;
 this.render('fullProfile', {
   data: function () {
     return Profiles.findOne(_id);
   }
 });
});

// Router.route('/users/:username', function() {
// 	var username = this.params.username;
// 	this.render('fullprofile', {
// 		data: function () {
// 			return Profiles.findOne({username: username});
// 		}
// 	});
// });

Router.route('/sign-out', {
  name: 'sign-out',
  onBeforeAction: function () {
    AccountsTemplates.logout();
    Router.go('index');
    //this.next(); //this line causes 'sign-out template not found error
  }
});

