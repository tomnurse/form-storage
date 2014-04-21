//--------------------------------
// formStorage v0.1.0
//--------------------------------

//Default configuration
var config = {

    //Replace data entered into password fields with asterisks
    hidePasswords: true,

    //Does the form continue to the defined action?
    ignoreAction: false,

    //Choose storage method, sessionStorage or localStorage
    storage: sessionStorage
};

//Multi-browser event setup
var e = e || window.event;

//Test for localStorage
var hasStorage = (function () {
    var mod = "";
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        sessionStorage.setItem(mod, mod);
        sessionStorage.removeItem(mod);
        return true;
    } catch (e) {
        console.warn("This browser does not fully support web storage.");
        return false;
    }
}());

//Set default (global) getStorage type
var bodyGetStorage = document.querySelector('body').getAttribute("data-getStorage");
var globalGetStorage = chooseStorageMethod(bodyGetStorage, config.storage);

//Set default (global) setStorage type
var bodySetStorage = document.querySelector('body').getAttribute("data-setStorage");
var globalSetStorage = chooseStorageMethod(bodySetStorage, config.storage);

var init = (function(){
    //Check localstorage support
    if (hasStorage) {

        //Find all forms on the page
        var forms = document.querySelectorAll('form');

        //Attach event to each form's submission
        for (var i = 0; i < forms.length; i++) {
            attachSubmitEvent(forms[i]);
        }

        //Populate elements with requested data
        populateData();
    }
}());

function setValue(method, key, value) {
    method.setItem(key, value);
}

function getValue(method, key) {
    try {
        var get = method.getItem(key);
        return get;
    } catch (e) {
        return false;
    }
}

function clearStorage(method) {
    method.clear();
}

function attachSubmitEvent(form){
    form.addEventListener('submit',function (e) {

        //Check for inline configuration overrides
        var dataStorage = form.getAttribute('data-setStorage');
        var dataIgnoreAction = form.getAttribute('data-ignoreAction');
        var dataHidePasswords = form.getAttribute('data-hidePasswords');

        //Set storage method
        storageMethod = chooseStorageMethod(dataStorage, globalSetStorage);

        //Toggle settins to hide password data
        if(typeof dataHidePasswords == 'undefined' || !dataHidePasswords){
            hidePasswords = config.hidePasswords;
        } else {
            if(dataHidePasswords == "true" || dataHidePasswords == "yes"){
                hidePasswords = true;
            } else if(dataHidePasswords == "false" || dataHidePasswords == "no"){
                hidePasswords = false;
            } else {
                hidePasswords = config.hidePasswords;
                console.warn('Incorrect password hiding syntax, reverting to default.');
            }
        }

        //Store form's data
        storeData.call(form, storageMethod, hidePasswords);

        //Set form action
        if(typeof dataIgnoreAction == 'undefined' || !dataIgnoreAction){
            formAction = config.ignoreAction;
        } else {
            if(dataIgnoreAction == "true" || dataIgnoreAction == "yes"){
                formAction = true;
            } else if (dataIgnoreAction == "false" || dataIgnoreAction == "no") {
                formAction = false;
            } else {
                formAction = config.ignoreAction;
                console.warn('Incorrect ignore form action syntax, reverting to default.');
            }
        }

        if(formAction === false){
            var action = form.action;
            setTimeout(function () { window.location = action; }, 100);
        }

        e.preventDefault();
        return false;
    });
}

//Iterate through inputs and store data
function storeData(method, hidePasswords) {

    //Get all fields in the form
    var fields = this.querySelectorAll('input:not([type=button]):not([type=submit]):not([type=reset]), select, textarea');

    //TODO: add multi-select?

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var tagname = field.tagName;
        var type = field.type;
        var name = "fs_" + field.name;
        var ignore = field.getAttribute("data-ignoreField");

        var fieldSetStorage = field.getAttribute("data-setStorage");
        var storageMethod = chooseStorageMethod(fieldSetStorage, method);

        //Ignore specified fields
        if(ignore == "true" || ignore == "yes"){
            continue;
        }

        if (tagname == "INPUT") {

            //Find and handle selected radio buttons and checkboxes
            if (type == "radio") {
                //Only count checked radio buttons
                if(field.checked){
                    setValue(storageMethod, name, field.value);
                }
            } else if (type == "checkbox"){
                setValue(storageMethod, name, field.checked);
            } else if (type == "password"){
                if(hidePasswords){
                    var regex = /./g;
                    var hiddenPass = field.value.replace(regex,"*");
                    setValue(storageMethod, name, hiddenPass);
                } else {
                    setValue(storageMethod, name, field.value);
                }
            } else {
                setValue(storageMethod, name, field.value);
            }

        } else if (tagname == "SELECT") {
            setValue(storageMethod, name, field.options[field.selectedIndex].textContent);
        } else if (tagname == "TEXTAREA") {
            setValue(storageMethod, name,field.value);
        }
    }
}

function populateData(){
    var dataName = document.querySelectorAll('[data-name]');

    //Iterate through elements requesting data
    for (var k=0; k < dataName.length; k++){

        //Check for element storage method (overrides global)
        var dataStorage = dataName[k].getAttribute('data-getStorage');
        var storageMethod = chooseStorageMethod(dataStorage, globalGetStorage);

        //Get data and populate
        var attr = "fs_" + dataName[k].getAttribute('data-name');
        var data = getValue(storageMethod, attr);
        if(data){
            dataName[k].innerHTML = data;
        }
    }
}

function chooseStorageMethod(inputStr, currentMethod){
    if(typeof inputStr == 'undefined' || !inputStr){
            method = currentMethod;
    } else {
        if (inputStr == "sessionStorage" || inputStr == "session"){
            method = sessionStorage;
        } else if(inputStr == "localStorage" || inputStr == "local"){
            method = localStorage;
        } else {
            method = currentMethod;
            console.warn('Incorrect storage method syntax, ignoring override.');
        }
    }

    return method;
}