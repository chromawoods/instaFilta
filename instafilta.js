/*!
 * instaFilta
 * Description: "jQuery plugin for performing in-page filtering"
 * Homepage: https://github.com/chromawoods/instaFilta
 * Author: Andreas Larsson <andreas@chromawoods.com> (http://chromawoods.com)
 * Contributions: Jaap-Jan Frans
 */
;(function($) {

    $.fn.instaFilta = function(options) {

        var settings = $.extend({
            scope: null,
            targets: '.instafilta-target',
            sections: '.instafilta-section',
            matchCssClass: 'instafilta-match',
            markMatches: false,
            hideEmptySections: true,
            beginsWith: false,
            caseSensitive: false,
            typeDelay: 0

        }, options);

        this.each(function() {

            var typeTimer,
                $targets,
                $sections,
                $scopeElement,
                lastTerm = '';

            if(settings.scope != null) {
                $scopeElement = $(this).closest(settings.scope);
                $targets = $scopeElement.find(settings.targets);
                $sections = $scopeElement.find(settings.sections);
            } else {
                $targets = $(settings.targets);
                $sections = $(settings.sections);
            }

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
                }

                $targets.each(function() {

                    var $item = $(this);

                    if (!$item.data('originalText')) {
                        $item.data('originalHtml', $item.html());
                        $item.data('originalText', $item.text());
                    }

                    var originalText = $item.data('originalText'),
                        targetText = settings.caseSensitive ? originalText : originalText.toLowerCase(),
                        matchedIndex = targetText.indexOf(term),
                        matchedText = null,
                        newText = null;

                    if (matchedIndex >= 0 && settings.markMatches) {
                        matchedText = originalText.substring(matchedIndex, matchedIndex + term.length);
                        newText = originalText.replace(matchedText, '<span class="' + settings.matchCssClass + '">' + matchedText + '</span>');

                        $item.html($item.data('originalHtml').replace(originalText, newText));
                    }

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


            $(this).on('keyup', onKeyUp);
        });

        return this;
    };

}(jQuery));