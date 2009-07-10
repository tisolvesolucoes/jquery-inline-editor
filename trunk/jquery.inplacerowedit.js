(function($) {
    $.fn.inplacerowedit = function(options) {
        var ops = $.extend($.fn.inplacerowedit.defaults, options);
        $(this).find(ops.editbuttonselector).click(function(e) {
            e.preventDefault();
            var editbtn = $(this);
            var td = editbtn.parents('td');
            var tr = editbtn.parents('tr:eq(0)');
            tr.children('td').each(function(i) {
                var self = $(this);
                if ($.inArray(i, ops.inputcolumns) < 0)
                    return;
                    
                // hide contents
                var text = self.text();
                var hiddenDiv = $('<div />').css('display', 'none').addClass('inplacerowedit-hidden').text(text);
                self.html(hiddenDiv);

                // add input
                var inputFunc = $.fn.inplacerowedit.inputtypes[ops.inputtypes[i]];
                var input = inputFunc(text, ops.inputoptions[i], self.height(), self.width());
                input.attr('name', ops.inputnames[i]);
                self.append(input);
            });
            tr.find(ops.buttonareaselector).hide();
            var btndiv = $('<div />');
            var savebtn = $('<a></a>').text(ops.updatebuttontext).addClass(ops.updatebuttonclass);
            btndiv.append(savebtn);
            btndiv.append('&nbsp;');
            var cancelbtn = $('<a></a>').text(ops.cancelbuttontext).addClass(ops.cancelbuttonclass);
            btndiv.append(cancelbtn);
            savebtn.click(function(e) {
                e.preventDefault();

                // build data
                var data = tr.find(':input').serializeArray();
                ops.beforesubmit(tr, data);

                // submit
                $.ajax({
                    async: false,
                    cache: false,
                    data: data,
                    dataType: 'json',
                    url: ops.action,
                    type: ops.method,
                    success: function(data, textStatus) {
                        btndiv.remove();
                        tr.children('td').each(function(i) {
                            if ($.inArray(i, ops.inputcolumns) < 0)
                                return;
                            $(this).text(data[i]);
                        });
                        tr.find(ops.buttonareaselector).show();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        cancelbtn.click();
                    }
                });
            });
            cancelbtn.click(function(e) {
                btndiv.remove();
                tr.children('td').each(function(i) {
                    if ($.inArray(i, ops.inputcolumns) < 0)
                        return;
                    var hiddenDiv = $(this).children('div.inplacerowedit-hidden');
                    $(this).empty();
                    $(this).html(hiddenDiv.html());
                });
                tr.find(ops.buttonareaselector).show();
                e.preventDefault();
            });
            td.append(btndiv);

        });
        return $(this);
    };
    $.fn.inplacerowedit.defaults = {
        beforesubmit: function(tr, data) { },
        buttonareaselector: 'div.buttons',
        editbuttonselector: 'a.edit',
        updatebuttontext: 'save',
        updatebuttonclass: 'update',
        cancelbuttontext: 'cancel',
        cancelbuttonclass: 'cancel',
        action: '',
        method: 'POST',
        inputnames: [],
        inputtypes: [],
        inputoptions: []
    };
    $.fn.inplacerowedit.inputtypes = Array();
    $.fn.inplacerowedit.inputtypes['text'] = function(val, options, tdheight, tdwidth) {
        return $('<input />').attr('type', 'text').height(tdheight).width(tdwidth).val(val);
    };
    $.fn.inplacerowedit.inputtypes['datepicker'] = function(val, options, tdheight, tdwidth) {
        var width = tdwidth < 75 ? tdwidth : 75;
        var textbox = $.fn.inplacerowedit.inputtypes['text'](val, options, tdheight, width);
        textbox.datepicker(options);
        return textbox;
    }
})(jQuery);