;(function($){
    $.fn.dynamicTable = function(options){
        defaults = {
            keyboard: true,
            button: true,
            buttonSelector: ".edit",
            maintainWidth: true,
            dropdowns: {},
            dynatableEdit: function() {},
            dynaTableSave: function() {}
        };
        this.options = $.extend({}, defaults, options);
        return this.each(function(){
            new dynatable(this, options);

        });
    };
    function dynatable(selector, options){
        this.selector = selector;
        this.options = options;
        this.initialize();
    };
    dynatable.prototype = {
        initialize: function(){
            this.editButton = false;
            if (this.options.button) {
                $(this.options.buttonSelector, this.selector).bind('click', this.toggle.bind(this));
            }
        },
        toggle: function(e) {
            e.preventDefault();
            this.editButton = !this.editButton;
            if (this.editButton) {
                this.dynatableEdit();
            } else {
                this.dynaTableSave();
            }
        },
        dynatableEdit: function() {
            var instance = this,
                values = {};
            $('td[data-colName]', this.selector).each(function() {
                var input,
                    colData = $(this).data('colName'),
                    value = $(this).text(),
                    width = $(this).width();

                values[colData] = value;

                $(this).empty();

                if (instance.options.maintainWidth) {
                    $(this).width(width);
                }

                if (colData in instance.options.dropdowns) {
                    input = $('<select></select>');

                    for (var i = 0; i < instance.options.dropdowns[colData].length; i++) {
                        $('<option></option>')
                            .text(instance.options.dropdowns[colData][i])
                            .appendTo(input);
                    };
                    input.val(value).data('old-value', value);
                } else {
                    input = $('<input type="text" class="'+field+'" name="'+field+'" style="width:'+width+'px"/>').val(value).data('old-value', value);
                }

                input.appendTo(this);

                if (instance.options.keyboard) {
                    input.keydown(instance.captureWhichKey.bind(instance));
                }
            });

            this.options.dynatableEdit.bind(this.selector)(values);
        },

        dynaTableSave: function() {
            var instance = this,
                values = {};

            $('td[data-colName]', this.selector).each(function() {
                var value = $(':input', this).val();
                values[$(this).data('colName')] = value;
                $(this).empty().text(value);
            });

            this.options.dynaTableSave.bind(this.selector)(values);
        },

        captureWhichKey: function(event){
            if (event.which === 13) {
                this.editButton = false;
                this.dynaTableSave();
            }
        }
    }
})(jQuery)
