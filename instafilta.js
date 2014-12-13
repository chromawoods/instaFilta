/*!
 * instaFilta
 * Description: "jQuery plugin for performing in-page filtering"
 * Version: "1.1.0"
 * Homepage: https://github.com/chromawoods/instaFilta
 * Author: Andreas Larsson <andreas@chromawoods.com> (http://chromawoods.com)
 */
;(function($) {

    $.fn.instaFilta = function(options) {
    
        var settings = $.extend({

            targets: '.instafilta-target',
            sections: '.instafilta-section',
            matchCssClass: 'instafilta-match',
            markMatches: false,
            hideEmptySections: true,
            beginsWith: false,
            caseSensitive: false,
            replaceAccents: false,
            accentsToFind: 'àáäâãèéëêìíïîòóöôõùúüûç',
            replaceWith: 'aaaaaeeeeiiiiooooouuuuc',
            typeDelay: 0

        }, options);
        

        var typeTimer,
            $targets = $(settings.targets),
            $sections = $(settings.sections),
            lastTerm = '';
        
        
        var hideEmptySections = function() {

            $sections.each(function() {
                var $section = $(this);
                $section.toggle(!!($section.find('[data-instafilta-hide="false"]').length));
            });

        };
        
        
        var doFiltering = function(term) {
            
            term = settings.caseSensitive ? term : term.toLowerCase();
            term = settings.replaceAccents ? replaceAccents(term) : term;
            
            if (lastTerm === term) { return false; }
            else { lastTerm = term; }

            if (!term) {
                $targets.attr('data-instafilta-hide', 'false').show();
                $sections.show();
            }
            
            $targets.each(function() {
                
                var $item = $(this),
                    originalText = $item.text(),
                    targetText = originalText,
                    matchedText = null;

                targetText = settings.caseSensitive ? originalText : originalText.toLowerCase();
                targetText = settings.replaceAccents ? replaceAccents(targetText) : targetText;

                var matchedIndex = targetText.indexOf(term);

                if (!$item.data('originalText')) { 
                    $item.data('originalText', originalText); 
                }

                else { $item.html($item.data('originalText')); }
                
                if (matchedIndex >= 0 && settings.markMatches) {
                    matchedText = originalText.substring(matchedIndex, matchedIndex + term.length);
                    $item.html(originalText.replace(matchedText, '<span class="' + settings.matchCssClass + '">' + matchedText + '</span>'));
                }

                $item.attr('data-instafilta-hide', (settings.beginsWith && matchedIndex !== 0) || matchedIndex < 0 ? 'true' : 'false');
            });
            
            $targets.filter('[data-instafilta-hide="true"]').hide();
            $targets.filter('[data-instafilta-hide="false"]').show();
            
            settings.hideEmptySections && hideEmptySections();            
        };
        
        var replaceAccents = function (term) {
            
            for (i = 0; i < settings.accentsToFind.length; i++) {
                term = term.replace(new RegExp(settings.accentsToFind.charAt(i), 'g'), settings.replaceWith.charAt(i));
            }

            return term;
        };
        
        var onKeyUp = function() {
            var $field = $(this);
            
            clearTimeout(typeTimer);
            
            typeTimer = setTimeout(function() {
                doFiltering($field.val());
            }, settings.typeDelay); 
        };
        
        return $(this).on('keyup', onKeyUp);
    };
    
}(jQuery));