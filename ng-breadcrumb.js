//@require bootstrap/css/bootstrap.css

angular.module('breadcrumb', [])
    .service('breadcrumb', function(){

        /**
         * @description 增加导航元素
         * @param {Scope}  scope 当前作用域
         * @param {string} href  导航链接
         * @param {string} label 导航的显示名称
         * @param {number} deep  导航item的深度,
         *                       用于计算item出现的位置和删除多余的导航item,
         *                       deep >= 0, 数值越大深度越深, 请根据页面逻辑自行设定
         */
        this.addItem = function(scope, href, label, deep){
            scope.$emit("breadcrumb", {href:href, name:label, deep:deep});
        }
    })

    .directive("breadcrumb", function(){
        return {
            restrict: 'EA',
            replace: true,
            template: '<ol ng-show="breadcrumbs.length > 1" class="breadcrumb">' +
                    '<li ng-repeat="breadcrumb in breadcrumbs" ng-class="{active:$last}">' +
                    '<a ng-show="!$last" ng-href="{{breadcrumb.href}}" ng-bind="breadcrumb.name"></a>' +
                    '<span ng-show="$last" ng-bind="breadcrumb.name"></span></li>' +
                    '</ol>',
            link: function (scope, element, attrs, ctrl) {
                /**
                 * @description 查找新item插入位置
                 * @param deep 新插入item深度
                 * @returns {number} 插入位置
                 */
                function findRemoveIndex(deep){
                    for(var i=scope.breadcrumbs.length - 1;i>=0;--i){
                        if(scope.breadcrumbs[i].deep < deep)
                            return i+1;
                    }
                    return 0;
                }


                scope.$on("breadcrumb", function(event, breadcrumb){
                    if(scope.breadcrumbs){
                        var deep = breadcrumb.deep;
                        var index = findRemoveIndex(deep);
                        scope.breadcrumbs.splice(index, scope.breadcrumbs.length - index, breadcrumb);
                    }else{
                        scope.breadcrumbs = [breadcrumb];
                    }
                });
            }
        }
    });
