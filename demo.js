$(function() {

    $('#ex1f').instaFilta({
        scope: '#ex1'
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

});