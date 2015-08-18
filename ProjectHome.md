jQuery plugin transforms a normal table into an editable one.  Complete control is given over which columns are editable.

## Example of use ##
```
        $('table.myTable').inplacerowedit({
            url: /Some/URL',
            inputs: {
                '0': { type: 'datepicker', name: 'OpenDate' },
                '1': { type: 'datepicker', name: 'CloseDate' },
                '2': { type: 'text', name: 'Cost' },
                '3': { type: 'text', name: 'Description' }
            }
        });
```

What happens is that the plugin sends the data to the server and expects a JSON response -- an Array with the new data to be populated in each edited row.  If there's a non-editable row, the array should have an empty element there.  In the future I'll make an option to update all rows but for now it just updates the rows that you edited.

## Options ##

  * **url** = where to send the data for edit
  * **method** = how to send the data ('POST' or 'GET'), default: 'POST'
  * **updatebuttontext** = default: 'save', what should the update button say?
  * **updatebuttonclass** = the class name to give the update button
  * **cancelbuttontext** = default: 'cancel', what should the cancel button say?
  * **cancelbuttonclass** = likewise for the cancel button
  * **beforesubmit** a function that takes the **tr** that's being edited and the **data** to be sent to the server.  You can use this to add data to send to the server (like an ID)
  * **buttonareaselector** = your table has an edit button right?  and possibly others?  these buttons must be hidden when we're in edit mode and replaced with other buttons (save & cancel).  this tells the plugin where to find these buttons (in the tr) -- by default the selector is 'div.buttons', so you can just place the buttons in a div with class 'buttons' and the plugin will do the rest
  * **editbuttonselector** = default: 'a.edit' -- plugin hooks into the click event to do its magic
  * **inputs** = indexed array of JSON objects with optional properties of: _name_, _type_, _options_, _disabled_
    * **name** = the name of the input element (this will be posted to the server)
    * **type** = the type of input element.  _text_ and _datepicker_ come out of the box but you can easily add your own
    * **options** = any options you want to send to the element creation function.  this could be options for the datepicker for example
    * **disabled** = set to _true_ to disable editing this field