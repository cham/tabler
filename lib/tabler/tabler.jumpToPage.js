(function(root, factory){
    'use strict';
    if(typeof define === 'function' && define.amd){
        define(['jquery', 'underscore'], function($, _){
            return factory($, _);
        });
    }else{
        root.tabler.jumpToPage = factory(root.jQuery, root._);
    }
})(this, function($, _){
    'use strict';

    function JumpToPage(options){
        _.extend(this, options || {});
    }
    JumpToPage.pluginName = 'jumpToPage';

    _.extend(JumpToPage.prototype, {
        render: function(table){
            var sizes = this.sizes || [20, 50, 100],
                pager = this.pager,
                id = _.uniqueId('tabler-jumpToPage'),
                html = ['<p class=jumpToPage>', '<label for="' + id + '">Jump to page</label>', '<input id="' + id + '" type="text" />'];

            html = html.concat(['</select>', '<button>Go</button></p>']);

            return html.join('\n');
        },
        attach: function(table){
            var self = this;
            if(!table.pager){
                throw new Error('jumpToPage plugin cannot be used without the pager plugin');
            }
            this.pager = table.pager;

            var renderPager = this.pager.renderPager;
            table.pager.renderPager = function(table, data, spec){
                var pager = renderPager.apply(this, arguments),
                    html = self.render();

                return pager.replace('</td>', html + '</td>');
            };

            function updatePageIndex(){
                var $input = table.$('p.jumpToPage input'),
                    val = $input.val();

                if(!val){
                    return;
                }
                val = parseInt(val, 10);
                if(_.isNaN(val) || val < 1){
                    $input.addClass('invalid');
                    return;
                }
                $input.removeClass('invalid');

                val = Math.min(val, table.pager.totalPages) - 1;

                self.pager.currentPage = val;

                table.render();
            }

            table.$el.delegate('p.jumpToPage button', 'click', function(e){
                updatePageIndex();
            });
            table.$el.delegate('p.jumpToPage input', 'keydown', function(e){
                if(e.which === 13){
                    e.preventDefault();

                    updatePageIndex();
                }
            });
        }
    });

    return JumpToPage;
});