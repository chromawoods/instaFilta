instaFilta
==========

*instaFilta does in-page filtering and has absolutely nothing to do with Instagram.*

Imagine that you have a web page displaying a huge list of data. It might be hard for the user to scan through all that data to find the thing he/she is interested in. instaFilta is a jQuery plugin that uses the input of a text field to perform in-page filtering, hiding non-matching items as the user types. Optionally, it can also filter out complete sections (groups of items) if there are no matching items in that section. If you don't use sections, you don't need to do anything special, it will work fine without specifying so.

Live demo
---------
http://chromawoods.com/instafilta/demo/

Options
-------

| Option | Type | Descriptions | Default value |
|---|:-:|---|:-:|
| targets | jQuery selector string | Classname of an individual item. | `'.instafilta-target'` |
| sections | jQuery selector string | Classname of the sections holding the items. | `'.instafilta-section'` |
| matchCssClass | string | Classname of the spans indicating matching text. | `'instafilta-match'` |
| markMatches | boolean | If true, matching text will get wrapped by a span having the class name of whatever the `matchCssClass` option is set to. | `false` |
| hideEmptySections | boolean | If using sections, this option decides whether to hide sections which did not have any matching items in them. | `true` |
| beginsWith | boolean | We can choose to match the beginning of an item's text, or anywhere within. | `false` |
| caseSensitive | boolean | Whether to ignore character casing. | `false` |
| typeDelay | integer | The filtering process takes place on the keyUp event. If you have a large list of items to process, you might want to set a higher value (in milliseconds) to prevent the filtering to be able to occur so frequently. So in other words, it would kind of "wait" a bit while the user types. | `0` |
| replaceAccents | boolean | When checking a possible match, accents specified in `accentsToFind` are replaced in the item's text (only for the current comparison, **without altering** the original item text) by their corresponding value found in `replaceWith`. As a consequence, the search becomes insensitive to accentuation (e.g. the term 'jose' will be a positive match both for 'jose' and for 'josé'). | `false` |
| accentsToFind | string | Accents to be found and replaced (just for the comparison, without altering the page's content) in the item's text. | `àáäâãèéëêìíïîòóöôõùúüûç` |
| replaceWith | string | Characters that will replace their corresponding accentuated character (i.e. the one that has the same position in the `accentsToFind` string) if the `replaceAccents` option is set to `true`. | `aaaaaeeeeiiiiooooouuuuc` |

Highlighting matching text
--------------------------
When filtering out list items, it might be valuable to highlight exactly what part of the text was matched. We can do this using the `markMatches` option. If set to `true`, the match will get wrapped by a span, having the `matchCssClass` option CSS class (which defaults to `instafilta-match`). Use this class to style the match within the item text.

Usage
-----
Call instaFilta on the text field that should be observed, passing any of the options in an object. In the below example, we have specified that we only want to match items that begin with whatever the user types in the text field.

```javascript
$('#username-filtering').instaFilta({
    targets: '.username',
    beginsWith: true
});