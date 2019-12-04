var users = require('./src/users.js');
var currencies = require('./src/currencies.js');


var wallet;
var username;
var to;

var loadCurrencies = function () {
    var cur = currencies.get;
    var sidebar = $('#sidebar');

    for (let i = 0; i < cur.length; i++) {
        var name = cur[i].name;
        var type = cur[i].type;
        item = '<div id="sidebar-' + type + '" style="margin: 10px; border: #7f7f7f solid 1px; padding: 5px;' +
            ' border-radius: 10px; text-align: center;"> ' + name + '</div>';

        item = $(item);
        item.click(function () {
            loadUsersForCurrency(type);
        });
        sidebar.append(item);
    }
};

var loadInitContent = function () {
    var content = $('#content');
    content.empty();
    for (let i = 0; i < wallet.length; i++) {
        var type = wallet[i].type;
        var ammount = wallet[i].ammount;
        item = '<div style="margin 20px; font-size: 20px;">' + type + ' : ' + ammount + '</div>';

        item = $(item);
        content.append(item);
    }
};

var loadUsersForCurrency = function (type) {
    var content = $('#content');
    content.empty();

    var forCurrency = users.getUsersWithCurrency(type);

    for (let i = 0; i < forCurrency.length; i++) {
        if (forCurrency[i].user !== username)
            var item = "<div style='font-size: 15px; border: #7f7f7f solid 1px; border-radius: 10px; margin:" +
                " 10px; width: 75px; text-align: center'>" + forCurrency[i].user + "</div>";
        item = $(item);

        item.click(function () {
            loadTransactionForm(forCurrency[i], type)
        });

        content.append(item);
    }
};

var loadTransactionForm = function (user, type) {
    var content = $('#content');
    content.empty();

    var form = "<form id=\"send\">\n" +
        "        <div id=\"fail\" style=\"display: none;\">Not enough cash</div>\n" +
        "        <div id=\"success\" style=\"display: none;\">Money Sent</div>\n" +
        "        <input type=\"text\" placeholder=\"Ammount\"  class=\"form-control\" id=\"ammount\" style=\"width: 250px;\n" +
        "        margin-top: 10px\" required/>\n" +
        "        <button type=\"submit\" class=\"btn btn-primary\">Send</button>\n" +
        "    </form>";

    form = $(form);

    form.submit(function (e) {
        e.preventDefault();

        transaction(form, user, type);
    });

    content.append(form);
};

var transaction = function (form, user, type) {
    var myIndex;
    var otherIndex;
    var otherWallet = user.wallet;
    for (let i = 0; i < wallet.length; i++) {
        if (wallet[i].type === type) {
            myIndex = i;
        }
    }

    for (let i = 0; i < otherWallet.length; i++) {
        if (otherWallet[i].type === type) {
            otherIndex = i;
        }
    }

    var fail = form.find('#fail');
    var success = form.find('#success');
    var ammount = parseInt(form.find('#ammount').val());

    console.log(ammount);
    console.log(wallet[myIndex].ammount);
    console.log(otherWallet[otherIndex].ammount);
    console.log(type);


    if (wallet[myIndex].ammount < ammount || ammount < 0) {
        fail.show();
        success.hide()
        return;
    } else {
        success.show();
        fail.hide();
    }
    wallet[myIndex].ammount = wallet[myIndex].ammount - ammount;
    otherWallet[otherIndex].ammount = otherWallet[otherIndex].ammount + ammount;

    users.writeUser(username, wallet);
    users.writeUser(user.user, otherWallet);
};

var loginForm = $('#login').submit(function (e) {
    e.preventDefault();

    username = $('#username').val();
    wallet = users.getWallet(username);
    var allert = $('#user-allert');

    if (wallet == null) {
        allert.show();
        return;
    }

    loginForm.hide();

    var mainContainer = $('#main-container');
    mainContainer.show();

    loadCurrencies();
    loadInitContent();
});




