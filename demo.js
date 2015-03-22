$(function() {

    var $resultMessage = $('#some-result-message');

    $('#ex1f').instaFilta({
        scope: '#ex1'
    });

    $('#ex1-2f').instaFilta({
        scope: '#ex1-2'
    });

    $('#ex2f').instaFilta({
        scope: '#ex2',
        targets: '.planet-name',
        caseSensitive: true
    });

    $('#ex3f').instaFilta({
        scope: '#ex3',
        markMatches: true
    });

    $('#ex4f').instaFilta({
        scope: '#ex4',
        beginsWith: true
    });

    $('#ex5f').instaFilta({
        scope: '#ex5',
        beginsWith: true
    });

    $('#ex6f').instaFilta({
        scope: '#ex6',
        onFilterComplete: function(matchedItems) {

            var message = matchedItems.length 
                ? "I found " + matchedItems.length + " matches!"
                : "I couldn't find a thing..";

            $resultMessage.text(message);
        }
    });

    var ex7 = $('#ex7f').instaFilta({
        scope: '#ex7'
    });

    $('#ex7s').on('change', function() {
        ex7.filterCategory($(this).val());
    });

});