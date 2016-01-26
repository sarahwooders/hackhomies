if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });


  Template.nav.helpers({
    teamCount: function () {
      if(Profiles.findOne({_id: Meteor.userId()})){
        return Profiles.findOne({_id: Meteor.userId()}).team.length;
      }
      return 0;
    },
    requestCount: function () {
      if(Profiles.findOne({_id: Meteor.userId()})){
        return Profiles.findOne({_id: Meteor.userId()}).receivedRequests.length;
      }
      return 0;
    }
  });

  Template.browse.rendered = function(){
    Profiles.find({}).fetch().sort(compare);
       function compare(p1, p2) {
          function score(p1, p2) { 
            var skillMatch = 0;
            for(var i = 0; i < p1.teamSkills.length; i ++) {
                for(var j = 0; j < p2.mySkills.length; j ++) {
                  if(p1.teamSkills[i] == p2.mySkills[j]) {
                    skillMatch ++;
                    break;
                  }
                }
            }
          var interestMatch = 0;
          for(var i = 0; i < p1.interests.length; i ++) {
              for(var j = 0; j < p2.interests.length; j ++) {
                if(p1.interests[i] == p2.interests[j]) {
                  interestMatch ++;
                  break;
                }
              }
          }
          var l1 = p1.level;
          var l2 = p2.level;
          return skillMatch/p1.teamSkills.length + interestMatch/p1.interests.length - Math.abs(l1 - l2);
        }
        var p = Profiles.findOne({_id: Meteor.userId()});
        var score1 = score(p, p1);
        var score2 = score(p, p2);
        if(score1 < score2) {
          return 1;
        } else if(score1 > score2) {
          return -1;
        } else {
          return 0;
        }
      }
  };

  Template.teams.helpers({
    profiles: function () {
      var targetTeam = Profiles.findOne({_id: this.targetID}).team;
      var Teammates = [];
      for(var i = 0; i < targetTeam.length; i++){
        var person = Profiles.findOne({_id: targetTeam[i]});
        Teammates.push(person);
      }
      return Teammates;
    },
    person: function () {
      if(this.targetID == Meteor.userId()){
        return 'My';
      } else {
        return Profiles.findOne({_id: this.targetID}).name + "'s";
      }
    },
    myTeam: function (){
      return (this.targetID == Meteor.userId() && Profiles.findOne({_id: this.targetID}).team.length > 0);
    }
  });

  Template.recommended.helpers({
    profiles: function() {
      return Profiles.find({});
    },
    compatable: function() {
      if(this._id == Meteor.userId()) {
          return false;
      } else {
        return score(Profiles.findOne({_id: Meteor.userId()}), Profiles.findOne(this._id)) >= 0;
      }
      function score(p1, p2) { //add more to this!!!
        var skillMatch = 0;
        for(var i = 0; i < p1.teamSkills.length; i ++) {
            for(var j = 0; j < p2.mySkills.length; j ++) {
              if(p1.teamSkills[i] == p2.mySkills[j]) {
                skillMatch ++;
                break;
              }
            }
        }
        var interestMatch = 0;
        for(var i = 0; i < p1.interests.length; i ++) {
            for(var j = 0; j < p2.interests.length; j ++) {
              if(p1.interests[i] == p2.interests[j]) {
                interestMatch ++;
                break;
              }
            }
        }
        var l1 = p1.level;
        var l2 = p2.level;
        return skillMatch/p1.teamSkills.length + interestMatch/p1.interests.length - Math.abs(l1 - l2);
      }
    }
  });

  Template.fullProfileHelper.helpers({
    beginner: function () {
        if(Profiles.findOne(this._id).level == 0) {
          return true;
        } else {
          return false;
        }
    },
    amature: function () {
        if(Profiles.findOne(this._id).level == 1) {
          return true;
        } else {
          return false;
        }
    },
    advanced: function () {
        if(Profiles.findOne(this._id).level == 2) {
          return true;
        } else {
          return false;
        }
    }
  });

  Template.requests.helpers({
    sent: function () {
      var mySentRequests = Profiles.findOne({_id: Meteor.userId()}).sentRequests;
      //alert(mySentRequests);
      var Teammates = [];
      for(var i = 0; i < mySentRequests.length; i++){
        var person = Profiles.findOne({_id: mySentRequests[i]});
        Teammates.push(person);
      }
      return Teammates;

      // return Profiles.find({
      //   _id: {$in: mySentRequests}
      // });
},
received: function () {
  var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
  var Teammates = [];
  for(var i = 0; i < myReceivedRequests.length; i++){
    var person = Profiles.findOne({_id: myReceivedRequests[i]});
    Teammates.push(person);
  }
  return Teammates;

},

});

Template.fullProfile.helpers({
  button: function () {
    var myProfile = Profiles.findOne({_id: Meteor.userId()});
    var personID = this._id;
    if(personID.length > 20){
      personID = this.__originalId;
    }
    if(personID  == Meteor.userId()){
      return;
    } else if(myProfile.team.indexOf(personID) > -1){
      return 'removeTeam';
    } else if(myProfile.receivedRequests.indexOf(personID) > -1){
      if(myProfile.team.length + Profiles.findOne({_id: personID}).team.length > 2){
        return 'disabledRespondRequest';
      }
      return 'respondRequest';
    } else if(myProfile.sentRequests.indexOf(personID) > -1){
      return 'deleteRequest';
    } else if (myProfile.team.length + Profiles.findOne({_id: personID}).team.length > 2){
      return 'disabledRequestTeam';
    } else {
      return 'requestTeam';
    }
  },
  compatable: function() {
    if(this._id == Meteor.userId()) {
        return false;
    } else {
      return score(Profiles.findOne({_id: Meteor.userId()}), Profiles.findOne(this._id)) >= 0;
    }
    function score(p1, p2) { //add more to this!!!
      var skillMatch = 0;
      for(var i = 0; i < p1.teamSkills.length; i ++) {
          for(var j = 0; j < p2.mySkills.length; j ++) {
            if(p1.teamSkills[i] == p2.mySkills[j]) {
              skillMatch ++;
              break;
            }
          }
      }
      var interestMatch = 0;
      for(var i = 0; i < p1.interests.length; i ++) {
          for(var j = 0; j < p2.interests.length; j ++) {
            if(p1.interests[i] == p2.interests[j]) {
              interestMatch ++;
              break;
            }
          }
      }
      var l1 = p1.level;
      var l2 = p2.level;
      return skillMatch/p1.teamSkills.length + interestMatch/p1.interests.length - Math.abs(l1 - l2);
    }
  }
});

Template.fullProfileHelper.helpers({
   personName: function() {
    //alert(this._id);
    //alert(Meteor.userId());
    if(this._id == Meteor.userId()){
      return "Me";
    } 
    return Profiles.findOne({_id: this._id}).name;
  },
  teamsize: function() {
    var size = Profiles.findOne({_id: this._id}).team.length;
    if(size == 1){
      return "1 Team Member";
    } else {
      return size + " Team Members";
    }

  }
});

  Template.createProfile.events({
    'submit': function (event) {
      var myProfile = {
        _id: Meteor.userId(),
        // id: Meteor.userId(),
        //pic: event.target.pic.value,
        name: event.target.name.value,
        school: event.target.school.value,
        email: event.target.email.value,
        level: $('.level').dropdown('get value'),        
        mySkills: $('.mySkills').dropdown('get value'),
        teamSkills: $('.teamSkills.dropdown').dropdown('get value'),
        interests: $('.interests.dropdown').dropdown('get value'),
        about: event.target.about.value,
      }

      // Meteor.call('updateProfile', myProfile);
      if(Profiles.findOne({_id: Meteor.userId()}))

        Profiles.update(
          {_id: Meteor.userId()},
          {$set: myProfile}
          );
      else{
        Profiles.insert(myProfile);
        Profiles.update(
          {_id: Meteor.userId()},
          {$set: {team: [], sentRequests: [], receivedRequests: []}}
          );
      }
        
      
      // Router.go('browse');
    }, 

    
  });

  Template.createProfile.helpers({
    data:function(){
      if(Profiles.findOne({_id: Meteor.userId()})){
        return Profiles.findOne({_id: Meteor.userId()});
      } else {
        return {email: Meteor.user().emails[0].address};
      }
    }
  });

  Template.createProfile.onRendered(function(){
    this.$(".ui.fluid.dropdown").dropdown();
    $('.ui.dropdown')
      .dropdown();
    $('.ui.form')
      .form({
        fields: {
          name: {
            identifier  : 'name',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your name.'
              }
            ]
          },
          school: {
            identifier  : 'school',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your school.'
              }
            ]
          },
          mySkills: {
            identifier  : 'mySkills',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your skills'
              }
            ]
          },
          teamSkills: {
            identifier  : 'teamSkills',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter skills you are looking for'
              }
            ]
          },
          experience: {
            identifier  : 'experience',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your level of experience'
              }
            ]
          },
          interests: {
            identifier  : 'interests',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter your interests'
              }
            ]
          },
          about: {
            identifier  : 'about',
            rules: [
              {
                type   : 'maxLength[100]',
                prompt : 'Please limit your life'
              }
            ]
          }
        }
      })
    ;
    
    if(Profiles.findOne({_id: Meteor.userId()})){
      this.$(".level").dropdown('set selected',  Profiles.findOne({_id: Meteor.userId()}).level)
      this.$("#mySkills").dropdown('set selected', Profiles.findOne({_id: Meteor.userId()}).mySkills);
      this.$("#teamSkills").dropdown('set selected', Profiles.findOne({_id: Meteor.userId()}).teamSkills);
      this.$("#interests").dropdown('set selected', Profiles.findOne({_id: Meteor.userId()}).interests);
    }
  });

  /***************************** Button Events ***************************/
  Template.fullProfile.events({
    'submit .requestTeam': function (event) {
      var target = event.currentTarget.getAttribute('data-id');
      if(Profiles.findOne({_id: Meteor.userId()}).team.length + Profiles.findOne({_id: target}).team.length > 4){
        alert('Team limit reached');
        return;
      }
      var mySentRequests = Profiles.findOne({_id: Meteor.userId()}).sentRequests;
      //var target = event.target.name.value;
      
      var targetReceivedRequests = Profiles.findOne({_id: target}).receivedRequests;
      mySentRequests.push(target);
      targetReceivedRequests.push(Meteor.userId());
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {sentRequests: mySentRequests}}
        );
      Profiles.update(
        {_id: target},
        {$set: {receivedRequests: targetReceivedRequests}}
        );
      return false;
    },

    'submit .deleteRequest': function (event) {
      var mySentRequests = Profiles.findOne({_id: Meteor.userId()}).sentRequests;
      var target = event.currentTarget.getAttribute('data-id');
      var index = mySentRequests.indexOf(target);
      var targetReceivedRequests = Profiles.findOne({_id: target}).receivedRequests;
      var targetIndex = targetReceivedRequests.indexOf(Meteor.userId());
      if(index > -1){
        mySentRequests.splice(target, 1);
      }
      if(targetIndex > -1){
        targetReceivedRequests.splice(targetIndex, 1);
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {sentRequests: mySentRequests}}
        );
      Profiles.update(
        {_id: target},
        {$set: {receivedRequests: targetReceivedRequests}}
        );
      return false;
    },

    'click #accept': function(event, template){
      // if(Profiles.findOne({_id: Meteor.userId()}).team.length >= 3){
      //   alert('Team limit reached');
      //   return;
      // }
      //alert("called");
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      var target = template.find(".respondRequest").getAttribute('data-id');
      var targetTeammates = Profiles.findOne({_id: target}).team;
      var myLength = myTeammates.length;
      var targetLength = targetTeammates.length;
      for(var i = 0; i < targetTeammates.length; i++){
        var t = Profiles.findOne({_id: targetTeammates[i]}).team;
        for(var j = 0; j < myTeammates.length; j++){
          if(t.indexOf(myTeammates[j]) == -1)
            t.push(myTeammates[j]);
        }
        if(t.indexOf(Meteor.userId()) == -1)
          t.push(Meteor.userId());
        Profiles.update({_id: targetTeammates[i]},{$set: {team: t}});
        myTeammates.push(targetTeammates[i]);
      }
      for(var i = 0; i < myTeammates.length - targetLength; i++){
        var t = Profiles.findOne({_id: myTeammates[i]}).team;
        for(var j = 0; j < targetTeammates.length; j++){
          if(t.indexOf(targetTeammates[j]) == -1)
            t.push(targetTeammates[j]);
        }
        if(t.indexOf(target) == -1)
          t.push(target);
        Profiles.update({_id: myTeammates[i]},{$set: {team: t}});
        targetTeammates.push(myTeammates[j]);
      }
      myTeammates.push(target);
      targetTeammates.push(Meteor.userId());
      Profiles.update({_id: Meteor.userId()}, {$set: {team: myTeammates}});
      Profiles.update({_id: target}, {$set: {team: targetTeammates}});

      //delete from received requests
      var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
      var target = template.find(".respondRequest").getAttribute('data-id');
      var targetSentRequests = Profiles.findOne({_id: target}).sentRequests;
      // var targetIndex;
      // for(var i = 0; i < myTeammates - 1; i++){
      //   var myTeamReceivedRequests = Profiles.findOne({_id: myTeammates[i]}).receivedRequests;
      //   var myTeamIndex = myTeam.find({_id: target});
      //   targetIndex = targetSentRequests.find({_id: myTeammates[i]});
      //   if(myTeamIndex > -1){
      //     myTeamReceivedRequests.splice(index, 1);
      //   }
      //   if(targetIndex > -1){
      //     targetSentRequests.splice(targetIndex, 1);
      //   }
      //   Profiles.update({_id: myTeamates[i]},{$set: {receivedRequests: myTeamReceivedRequests}});
      //   Profiles.update({_id: target},{$set: {sentRequests: targetSentRequests}});
      // }
      var index = myReceivedRequests.indexOf(target);
      var targetIndex = targetSentRequests.indexOf(Meteor.userId());
      if(index > -1){
        myReceivedRequests.splice(index, 1);
      }
      if(targetIndex > -1){
        targetSentRequests.splice(targetIndex, 1);
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {receivedRequests: myReceivedRequests}}
        );
      Profiles.update(
        {_id: target},
        {$set: {sentRequests: targetSentRequests}}
        );
      return false;
    },

    'click #decline': function(event, template){
      var myReceivedRequests = Profiles.findOne({_id: Meteor.userId()}).receivedRequests;
      var target = template.find(".respondRequest").getAttribute('data-id');
      var index = myReceivedRequests.indexOf(target);
      var targetSentRequests = Profiles.findOne({_id: target}).sentRequests;
      var targetIndex = targetSentRequests.indexOf(Meteor.userId());
      if(index > -1){
        myReceivedRequests.splice(index, 1);
      }
      if(targetIndex > -1){
        targetSentRequests.splice(targetIndex, 1);
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {receivedRequests: myReceivedRequests}}
        );
      Profiles.update(
        {_id: target},
        {$set: {sentRequests: mySentRequests}}
        );
      return false;
    }

  });

  Template.teams.events({
    'submit .leaveTeam': function(event){
      //alert('clicked');
      var myTeammates = Profiles.findOne({_id: Meteor.userId()}).team;
      for(var i = 0; i < myTeammates.length; i++){
        var t = Profiles.findOne({_id: myTeammates[i]}).team;
        //alert(t);
        var index = t.indexOf(Meteor.userId());
        //alert(index);
        if(index > -1){
          t.splice(index, 1);
        }
        Profiles.update({_id: myTeammates[i]},{$set: {team: t}});
      }
      Profiles.update(
        {_id: Meteor.userId()},
        {$set: {team: []}}
        );
      return false;
    }
  });

  /****************************** Search *******************************/

  Template.searchBox.helpers({
    profilesIndex: function(){
      return ProfilesIndex;
    },
    inputAttributes: function(){
      return { 
        'class': 'prompt', 
        'placeholder': 'Search teammates...' 
      };

    },
    actualProfile: function (){
      var actualID = this.__originalId;
      return Profiles.findOne({_id: actualID});
    }
  });


}

