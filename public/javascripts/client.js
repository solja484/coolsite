function validateUkrForm(){
   let a= validEmail("ukr_email");
   let b=  validEmpty("ukr_name");
   let c= validPhone("ukr_phone");
return a&&b&&c;

}
function validateEngForm(){
    validEmail("eng_email");
    validEmpty("eng_name");
    validPhone("eng_phone");
    return validEmail("eng_email") && validEmpty("eng_name")&&validPhone("eng_phone");

}

function validEmpty(str) {
    const selector = $("#" + str);
    let edu = selector.val();
    if (edu === "") {
        selector.removeClass('is-valid');
        selector.addClass('is-invalid');
        return false;
    }
    selector.removeClass('is-invalid');
    selector.addClass('is-valid');
    return true;
}

function validEmail(str) {
    const selector = $("#" + str);
    let name = selector.val();
    if (name.length < 1 || name.length > 100) {
        selector.removeClass('is-valid');
        selector.addClass('is-invalid');
        return false;
    }
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (name.match(pattern)) {
        selector.removeClass('is-invalid');
        selector.addClass('is-valid');
        return true;
    } else {
        selector.removeClass('is-valid');
        selector.addClass('is-invalid');

        return false;
    }
}
//095 83 40 484
function validPhone(str) {
    const selector = $("#" + str);
    let phone = selector.val();
    if(phone==""){
        selector.removeClass("is-invalid");
        selector.removeClass('is-valid');
        return true;

    }
    let pattern = /^\d+$/;
    let pattern2 = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
    if (phone.match(pattern) && phone.length === 10 || phone.match(pattern2)) {
        selector.removeClass('is-invalid');
        selector.addClass('is-valid');
        return true
    }
    selector.removeClass('is-valid');
    selector.addClass('is-invalid');
    return false;
}


