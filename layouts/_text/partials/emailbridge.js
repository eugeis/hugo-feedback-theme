    var emailbridge = "{{ .Params.emailbridge }}"

    var questionsCount = {{ partial "questionsCount.html" .feedback }}
    var raiting = new Array(questionsCount);

    var emailSubject = ""
    var emailName = ""

    function onRatingSzChange(ratingText, ratingValue, questionIdx) {
        raiting[questionIdx] = {}
        raiting[questionIdx].text = ratingText
        raiting[questionIdx].value = ratingValue
    }

    function raitingQuestion(questionIdx) {
        var rated = raiting[questionIdx]
        if (rated) {
            return rated.text + "(" + rated.value + ")"
        } else {
            return "Keine Bewertung"
        }
    }

    function raitingNode() {
        return document.getElementById("raitingNote").value
    }

    function buildEmailBody() {
        var ret = `<html><body>
        <h1>Predigtbewertung</h1>
        <h2>${ emailSubject }</h2>
        <span><i>Skala 1 bis 5 (5 = Bester Wert)</i></span>
    {{- $questionIdx := 0 }}
    {{- range $group, $questions := .feedback }}
        {{- if $group }}
        <h2>{{- $group }}</h2>
        {{- end -}}
        {{- range $idx, $question := $questions -}}
        <p>
            {{- if and .Params.showKeyword $question.keyword -}}
            <span>{{ $question.keyword }}: </span>
            {{- end -}}
            <span>{{ $question.question -}}</span>
            {{- if $question.note -}}
            <span>{{ $question.note }}: </span>
            {{- end -}}
            </br><span><strong> ${ raitingQuestion({{- $questionIdx }}) }</strong> aus ({{ delimit $question.rating.scala ";" }})</<span>
        </p>
            {{- $questionIdx = add $questionIdx 1 -}}
        {{- end -}}
    {{- end -}}
        <h2>Zusammenfassung</h2>
        <p>${ raitingNode() }</p></body></html>`;
        return ret;
    }

    function sendEmail(button) {
        //var sendEmail = button.disabled = true;
        var emailCode = getUrlVars()["emailCode"];
        if (emailCode && emailCode != "") {

            var emailBody = buildEmailBody()
            console.log(emailBody)

            $.ajax({
                data: {
                    emailBody: emailBody
                },
                success: function (data) {
                    console.log("device control succeeded");
                },
                error: function (err) {
                    console.log("Device control failed");
                },
                type: 'POST',
                url: emailbridge + "/sendemail?emailCode=" + emailCode
            });
            button.innerText = "Gesendet an " + emailName
        } else {
            button.innerText = "Absenden unmöglich, da keine Email Daten"
        }
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