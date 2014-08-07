/*!
 * instaFilta
 * Description: "jQuery plugin for performing in-page filtering"
 * Version: "1.0.0"
 * Homepage: https://github.com/chromawoods/instaFilta
 * Author: Andreas Larsson <andreas@chromawoods.com> (http://chromawoods.com)
 */
;(function($) {

    $.fn.instaFilta = function(options) {
    
        var settings = $.extend({

            targets: '.instafilta-target',
            sections: '.instafilta-section',
            hideEmptySections: true,
            beginsWith: false,
            caseSensitive: false,
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
            
            if (lastTerm === term) { return false; }
            else { lastTerm = term; }

            if (!term) {
                $targets.attr('data-instafilta-hide', 'false').show();
                $sections.show();
                return false;
            }
            
            $targets.each(function() {
                
                var $item = $(this),
                    targetText = settings.caseSensitive ? $item.text() : $item.text().toLowerCase(),
                    matchedIndex = targetText.indexOf(term);
                
                $item.attr('data-instafilta-hide', (settings.beginsWith && matchedIndex !== 0) || matchedIndex < 0 ? 'true' : 'false');
            });
            
            $targets.filter('[data-instafilta-hide="true"]').hide();
            $targets.filter('[data-instafilta-hide="false"]').show();
            
            settings.hideEmptySections && hideEmptySections();            
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