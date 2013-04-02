var CodeShare = function () {
    var dh = {
        NextTabIndex: 0,

        GetSnippet: function(languageCode, languageName) {
            $('#language-code').val(languageCode);
            $('#language-name').val(languageName);
            $('#snippet-model').modal('show');
        },
        
        PublishSnippet: function () {
            gapi.hangout.data.submitDelta(
                {
                    PostedBy: gapi.hangout.getLocalParticipant().person.displayName,
                    LanguageName: $('#language-name').val(),
                    LanguageCode: $('#language-code').val(),
                    CodeSnippet: JSON.stringify($('<div/>').text($("#code-input").val()).html())
                });
        },

        SaveSnippet: function (data) {
            this.NextTabIndex += 1;
            var snippetName = getCurrentTime() + " " + data.LanguageName;
            var tabId = "tab" + this.NextTabIndex;

            $('#snippets > ul').prepend("<li><a href=\"#" + tabId + "\" data-toggle=\"tab\">" + snippetName + "<br/><span class=\"label label-info\">" + data.PostedBy + "</span></a></li>");
            $('#snippets > div').prepend(
                "<div class=\"tab-pane\" id=\"" + tabId + "\">" +
                    "<pre class=\"brush: " + data.LanguageCode + ";toolbar: false;\" >" + JSON.parse(data.CodeSnippet) + "</pre>" +
                "</div>");

            SyntaxHighlighter.highlight();

            $('#code-input').val("");
            $('#snippet-model').modal('hide');

            $('#snippets a:first').tab('show');
        }
    };

    return dh;

    function getCurrentTime() {
        var now = new Date();

        var hour = now.getHours();
        if (hour < 10) { hour = "0" + hour; }

        var min = now.getMinutes();
        if (min < 10) { min = "0" + min; }

        var sec = now.getSeconds();
        if (sec < 10) { sec = "0" + sec; }

        return hour + ":" + min + ":" + sec;
    }
}();

$(document).ready(function () {
    $("#languages li > a").click(function () {
        CodeShare.GetSnippet($(this).attr("data-value"), $(this).html());
    });
    $("#snippets").on("click", "a", function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    
    gapi.hangout.data.onStateChanged.add(function (stateChangeEvent) {
        var state = stateChangeEvent.state;
        if (state && state.LanguageName) {
            CodeShare.SaveSnippet(state);
        }
    });

    $(window).resize(function () {
        resizeSnippet();
    });

    function resizeSnippet() {
        $('.tab-content').height($(window).height() - 20);
    }

    resizeSnippet();
});