'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The groupForm component', function() {
  var $rootScope, $compile;

  beforeEach(function() {
    angular.mock.module('linagora.esn.group');
    angular.mock.module(function($provide) {
      $provide.value('translateFilter', text => text);
    });
  });

  beforeEach(angular.mock.inject(function(
    _$rootScope_,
    _$compile_
  ) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  function initComponent(html) {
    var scope = $rootScope.$new();
    var element = $compile(html || '<group-form />')(scope);

    scope.$digest();

    return element;
  }

  it('should display inputs to create/update group', function() {
    var element = initComponent('<group-form group="group" />');

    expect(element.find('input[ng-model="$ctrl.group.name"]')).to.have.length(1);
    expect(element.find('esn-email-input')).to.have.length(1);
    expect(element.find('group-member-auto-complete')).to.have.length(1);
  });

  it('should not display member input when update mode is enabled', function() {
    var element = initComponent('<group-form group="group" update-mode="true" />');

    expect(element.find('group-member-auto-complete')).to.have.length(0);
  });
});
