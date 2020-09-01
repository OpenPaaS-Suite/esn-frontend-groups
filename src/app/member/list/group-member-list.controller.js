'use strict';

const _ = require('lodash');

require('../../common/group-api-client.service.js');
require('../../app.constants.js');

angular.module('linagora.esn.group')
  .controller('GroupMemberListController', GroupMemberListController);

function GroupMemberListController(
  $scope,
  $modal,
  infiniteScrollHelper,
  groupApiClient,
  GROUP_EVENTS,
  ELEMENTS_PER_REQUEST
) {
  var self = this;
  var DEFAULT_LIMIT = ELEMENTS_PER_REQUEST || 20;
  var options = {
    offset: 0,
    limit: DEFAULT_LIMIT
  };

  self.$onInit = $onInit;
  self.onAddMembersBtnClick = onAddMembersBtnClick;

  function $onInit() {
    self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems, null, DEFAULT_LIMIT);
    $scope.$on(GROUP_EVENTS.GROUP_MEMBERS_REMOVED, function(event, data) {
      _onMembersRemoved(data);
    });
    $scope.$on(GROUP_EVENTS.GROUP_MEMBERS_ADDED, function(event, data) {
      _onMembersAdded(data);
    });
  }

  function onAddMembersBtnClick() {
    $modal({
      template: require('../../update/members/group-add-members.pug'),
      backdrop: 'static',
      placement: 'center',
      controllerAs: '$ctrl',
      controller: 'GroupAddMembersController',
      locals: {
        group: self.group
      }
    });
  }

  function _onMembersRemoved(members) {
    members.forEach(function(member) {
      _.remove(self.elements, member);
    });
  }

  function _onMembersAdded(members) {
    members.forEach(function(member) {
      self.elements.unshift(member);
    });
  }

  function _loadNextItems() {
    options.offset = self.elements.length;

    return groupApiClient.getMembers(self.group.id, options)
      .then(function(response) {
        return response.data;
      });
  }
}
