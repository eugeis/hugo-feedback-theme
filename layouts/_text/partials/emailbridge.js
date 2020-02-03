    var emailbridge = "{{ .Params.emailbridge }}"
   
    var feedback = {{ .feedback | jsonify }}

    {{ $groupNr := 1 }}
    {{- range $group, $questions := .feedback -}}
    var fbGr{{ $groupNr }} = feedback["{{$group}}"]{{ $groupNr = add $groupNr 1 }}
    {{end}}
    var emailSubject = ""
    var emailName = ""

    function onRatingSzChange(ratingText, ratingValue, jsonItem) {
        jsonItem.rated = {}
        jsonItem.rated.text = ratingText
        jsonItem.rated.value = ratingValue
    }

    function sendEmail(button) {
        var sendEmail = button.disabled = true;

        var emailCode = getUrlVars()["emailCode"];
        if (emailCode && emailCode != "") {
            $.ajax({
                contentType: 'application/json',
                data: {
                    feedback
                },
                dataType: 'json',
                success: function (data) {
                    app.log("device control succeeded");
                },
                error: function () {
                    app.log("Device control failed");
                },
                processData: false,
                type: 'POST',
                url: emailbridge + "?emailCode=" + emailCode
            });
            button.innerText = "Gesendet an " + emailName
        }

        button.innerText = "Gesendet an " + emailName
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    function ready() {
        if (emailbridge != "") {
            var emailCode = getUrlVars()["emailCode"];
            if (emailCode && emailCode != "") {
                $.getJSON(emailbridge + "?emailCode=" + emailCode, function (emailData) {

                    emailName = emailData.Name
                    emailSubject = emailData.Subject

                    $("#subject").text(emailData.Subject);
                    $("#sendEmail").html("Absenden an " + emailData.Name);
                });
            }
        }
    }
    document.addEventListener("DOMContentLoaded", ready);