var labelText = ['country', 'rmc'];
var grid;
var popupData;
var popup;
var countries;
var table;

$.getJSON( "data/countries.json" , function( result ){
    countries = result;
});

$.getJSON( "data/message.json" , function( result ){
    popupData = result[0];
});

$(document).ready(function() {
    $("#table").kendoGrid({
        dataSource: {
            transport: {
                read: "data/countries.json"
            },
            sort: {
                field: "country",
                dir: "asc"
            }
        },
        filterable: {
            mode: "row"
        },
        sortable: true,
        scrollable:false,
        columns: [
            {
                field: "country",
                title: "Country",
                filterable: {
                    operators: {
                        string: {
                            contains: "Contains"
                        }
                    }
                }
            }, {
                field: "quantity",
                title: "Quantity",
                sortable: false,
                filterable: false
            }, {
                field: "rmc",
                title: "RMC",
                sortable: false,
                filterable: {
                    operators: {
                        string: {
                            contains: "Contains"
                        }
                    }
                }
            }
        ]
    });


    grid = $("#table").data("kendoGrid");
    grid.bind("dataBound", function() {
        labelText.forEach(function(text) {
            if (!document.querySelector('[data-text-field="' + text + '"]').parentNode.querySelectorAll('label').length) {
                var prnt = document.querySelector('[data-text-field="' + text + '"]').parentNode;
                var newLbl = document.createElement('label');
                newLbl.innerText = text;
                prnt.insertBefore(newLbl, prnt.firstChild);
            }
        });

        document.querySelectorAll('#table tbody[role="rowgroup"] tr').forEach(function(element) {
            element.setAttribute('v-on:click','onClick');
        });

        if (typeof table == 'object') {
            table.$destroy();
            table = undefined;
        }

        table = new Vue({
            el: '#table',
            methods: {
                onClick: function(e) {
                    var el = e.target,
                        rmc = el.parentNode.querySelector('td:last-child').innerText,
                        price = '';

                    popup.$data.showPopup = !popup.$data.showPopup;

                    for (var i in countries) {
                        if (countries[i].rmc==rmc) {
                            price = countries[i].price;
                            break;
                        }
                    }

                    popup.$data.productMessage = popup.$data.defaultMessage.replace('&1', rmc).replace('&2', price)
                }
            }
        });

        if (typeof popup === 'undefined') {
            popup = new Vue({
                el: '#popup',
                data: {
                    title: popupData.popupTitle,
                    question: popupData.question,
                    defaultMessage: popupData.message,
                    cancel: popupData.cancel,
                    confirm: popupData.confirm,
                    showPopup: false,
                    productMessage: ''
                },
                methods: {
                    onClick: function() {
                        popup.$data.showPopup = !popup.$data.showPopup;

                    }
                }
            });
        }
    });
});