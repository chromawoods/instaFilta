/*!
 * instaFilta
 * Version: 1.3
 * Description: jQuery plugin for performing in-page filtering
 * Homepage and documentation: https://github.com/chromawoods/instaFilta
 * Author: Andreas Larsson <andreas@chromawoods.com> (http://chromawoods.com)
 * Contributions: Jaap-Jan Frans
 */
;(function($) {


    $.fn.instaFilta = function(options) {

        var _filterTerm = null,
            _filterCategory = null;


        /* Default settings. */
        var settings = $.extend({

            scope: null,
            targets: '.instafilta-target',
            sections: '.instafilta-section',
            categoryDataAttr: 'instafilta-category',
            matchCssClass: 'instafilta-match',
            markMatches: false,
            hideEmptySections: true,
            beginsWith: false,
            caseSensitive: false,
            typeDelay: 0,
            useSynonyms: true,
            synonyms: [
                { src: 'à,á,å,ä,â,ã', dst: 'a' },
                { src: 'À,Á,Å,Ä,Â,Ã', dst: 'A' },
                { src: 'è,é,ë,ê', dst: 'e' },
                { src: 'È,É,Ë,Ê', dst: 'E' },
                { src: 'ì,í,ï,î', dst: 'i' },
                { src: 'Ì,Í,Ï,Î', dst: 'I' },
                { src: 'ò,ó,ö,ô,õ', dst: 'o' },
                { src: 'Ò,Ó,Ö,Ô,Õ', dst: 'O' },
                { src: 'ù,ú,ü,û', dst: 'u' },
                { src: 'Ù,Ú,Ü,Û', dst: 'U' },
                { src: 'ç', dst: 'c' },
                { src: 'Ç', dst: 'C' },
                { src: 'æ', dst: 'ae' }
            ]
        }, options);


        /* Split synonym src into arrays. */
        if (settings.useSynonyms) {
            for (var i = 0, l = settings.synonyms.length; i < l; i++) {
                settings.synonyms[i].src = settings.synonyms[i].src.split(',');
            }
        }


        /* Setup each instaFilta instance. */
        this.each(function() {

            var typeTimer,
                $targets,
                $sections,
                $scopeElement,
                lastTerm = '';

            /* Check if this instance should be bound to a scope. */
            if (settings.scope) {
                $scopeElement = $(this).closest(settings.scope);
                $targets = $scopeElement.find(settings.targets);
                $sections = $scopeElement.find(settings.sections);
            } else {
                $targets = $(settings.targets);
                $sections = $(settings.sections);
            }


            /* Prepare value(s) to match against. */
            $targets.each(function() {

                $target = $(this), original = $target.text();

                $target.data('values', (function(s) {

                    var values = [original], normalized = original;

                    if (!settings.useSynonyms) { return values; }

                    for (var i = 0, l = s.length; i < l; i++) {
                        for (var j = 0; j < s[i].src.length; j++) {
                            normalized = normalized.replace(s[i].src[j], s[i].dst);
                        }
                    }

                    !!(normalized === original) || values.push(normalized);
                    return values;
                }(settings.synonyms)));

            });


            /* Will hide any sections that don't have data-instafilta-hidden="false" */
            var hideEmptySections = function() {

                $sections.each(function() {
                    var $section = $(this);
                    $section.toggle(!!($section.find('[data-instafilta-hide="false"]').length));
                });

            };


            var applyResults = function() {
                var $shown = $targets.filter('[data-instafilta-hide="false"]').show();

                $targets.filter('[data-instafilta-hide="true"]').hide();

                settings.hideEmptySections && hideEmptySections();
                return $shown;
            };


            var showAll = function() {
                $targets.attr('data-instafilta-hide', 'false').show();
                $sections.show();
            };


            /* Main filtering function. */
            _filterTerm = function(term) {

                term = settings.caseSensitive ? term : term.toLowerCase();

                if (lastTerm === term) { return false; }
                else { lastTerm = term; }

                term || showAll();

                /* Iterate through associated targets and find matches. */
                $targets.each(function() {

                    var $item = $(this);

                    if (!$item.data('originalText')) {
                        $item.data('originalHtml', $item.html());
                        $item.data('originalText', $item.data('values')[0]);
                    }

                    /* Returns the index at which a match was found. Returns -1 if not found. */
                    var matchedIndex = (function(values, t) {
                        var index = -1;

                        for (var i = 0; i < values.length; i++) {
                            index = (settings.caseSensitive ? values[i] : values[i].toLowerCase()).indexOf(t);
                            if (index >= 0) { break; } // We have a match, no need to iterate further.
                        }

                        return index;
                    }($item.data('values'), term));

                    var originalText = $item.data('originalText'),
                        targetText = settings.caseSensitive ? originalText : originalText.toLowerCase(),
                        matchedText = null,
                        newText = null;

                    /* If we should mark the match, wrap it in a span tag. */
                    if (matchedIndex >= 0 && settings.markMatches) {
                        matchedText = originalText.substring(matchedIndex, matchedIndex + term.length);
                        newText = originalText.replace(matchedText, '<span class="' + settings.matchCssClass + '">' + matchedText + '</span>');

                        $item.html($item.data('originalHtml').replace(originalText, newText));
                    }

                    $item.attr('data-instafilta-hide', (settings.beginsWith && matchedIndex !== 0) || matchedIndex < 0 ? 'true' : 'false');
                });

                return applyResults();
            };


            /* Filter items depending on category data attribute. Categories can be comma separated. */
            _filterCategory = function(category) {

                var getCats = function($elem) {
                    return ($elem.data(settings.categoryDataAttr) || '').split(',');
                };

                /* Find sections that are categories. */
                $sections.each(function() {

                    var $sect = $(this)
                        sectCategories = getCats($sect);

                    /* Find items that belong to categories. */
                    $sect.find(settings.targets).each(function() {

                        var $item = $(this), 
                            hasCategory = false,
                            categories = getCats($item).concat(sectCategories);

                        for (var i = 0; i < categories.length; i++) {

                            /* Strip whitespace and compare. */
                            if (category === categories[i].replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')) { 
                                hasCategory = true;
                                break;
                            }
                        }

                        $item.html($item.data('originalText'))
                            .attr('data-instafilta-hide', hasCategory ? false : true);
                    });

                });

                category || showAll();
                return applyResults();
            };


            /* Setup event handlers. */
            $(this).on('keyup', function() {
                var $field = $(this);

                clearTimeout(typeTimer);

                typeTimer = setTimeout(function() {
                    _filterTerm($field.val());
                }, settings.typeDelay);
            });

        });


        return { 
            filterTerm: _filterTerm,
            filterCategory: _filterCategory
        };

    };

}(jQuery));