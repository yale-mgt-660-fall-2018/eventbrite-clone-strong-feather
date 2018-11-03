AdminForms.Directives.CompanyCard = function() {
  return {
    scope:{},
    controller: 'CompanyFormCardCtrl as ctrl',
    bindToController: {
      company: "=company",
      index: "=index"
    },
    restrict: 'E', // make a custom element.
    templateUrl: '../templates/admin/company-form.html'
  };
};