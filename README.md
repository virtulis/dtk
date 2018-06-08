# TypeScript DOM Toolkit

A minimalistic procedural library for DOM manipulation.

 * **Intended for TypeScript.**
Functions are designed specifically to provide as much type info as possible.
 * **No dependencies.** Using only native modern DOM APIs.
 * **No wrappers.** All functions accept and return real DOM elements
so you can use all the standard methods without any kludges.

Here's [a codepen](https://codepen.io/virtulis/pen/bKwEpq) with a few examples.

#### Table of contents

 - [Installation and usage](#installation-and-usage)
 - [Methods](#methods)
   * [`get()` and `list()`](#get-and-list)
   * [`create()`](#create)
   * [`prop()`](#prop)
   * [`attr()`](#attr)
   * [`append()`](#append)
   * [`on()`](#on)
 - [Feedback](#feedback)
 - [License](#license)

## Installation and usage

`npm i dtk` should do it.

Then just `import { create, get } from 'dtk'`.
Or go crazy and `import * as dtk from 'dtk'`. Your call.

There's also `dist/dtk.bundle.js` that you can drop right into your HTML
and get a global `dtk` object.

## Methods

There are just a few but that's just because
almost everything you could need is already available in vanilla DOM.

### `get()` and `list()`

A wrapper around `querySelector` and `querySelectorAll` respectively.

    get(root, tag, selectors);
    list(root, tag, selectors);

Returns one or all elements matching *tag* and *selectors* in *root*.

All arguments are optional.
*root* is `document.body` by default.
*tag* can be given separately to provide correct return type.

You *can* use multiple selectors in a string separated with a comma
and selectors *can* start with a `>` to match immediate children of *root*.

Note that tag will be prepended to the innermost selector.

For example:

    get('div'), // gets the first div in the document
    list('div'), // gets all divs in the document
    list('div.foo'), // gets all divs with class foo (returns HTMLElement[])
    list('div', '.foo'), // same as above but returns HTMLDivElement[]
    list('div', '.foo, .oof'), // gets all divs having class foo or oof
    list('div', '> *'), // gets all divs that are immediate children of body
    list(get('div'), '> *'), // gets all immediate children of first div
    list('div > *'), // gets all immediate children of all divs
    list('> div > *, script, p, h1'), // gets lots of different stuff

### `create()`

Creates an element with a specified tag, class name or props and children.

    create(tag, cls | props, ...children)

Everything but the tag is optional. SVG tags are supported too.

If the second argument is a string, it will be set as the element's `className`,
otherwise it will be passed to [`prop`](#prop). Note that these are *properties* -
if you need to set *attributes*, use the `$` key (see `prop()`).

Children can be elements, arrays of elements
or strings that will be converted to text nodes (see [`append`](#append)).
If a single string is passed it will be set as element's `innerText`.

### `prop()`

Sets element's property or properties, or returns a value of a single property.

    prop(el, name); // returns value of property
    prop(el, name, value); // sets value of property
    prop(el, { n1: v1, n2: v2 }); // sets multiple properties

A special key `$` can be used to set attributes too
(object is passed to [`attr`](#attr)).

    prop(circle, { $: {
        stroke: 'black',
        'stroke-width': 1,
    }});

### `attr()`

Sets element's attribute or attributes, or returns a value of a single attribute.

    attr(el, name); // returns value of attribute
    attr(el, name, value); // sets value of attribute
    attr(el, { n1: v1, n2: v2 }); // sets multiple attributes

### `append()`

Appends any number of elements or text nodes to an element.

    append(target, text, element, elementarray...)

Children can be elements, arrays of elements
or strings that will be converted to text nodes.

### `on()`

Adds an event listener to an element with features similar to jQuery's `.on()`.

    on(element, event, filter, this, handler, options)

 * element - where the listener will be added - `window` by default
 * event - *required* - name of the event or multiple events separated by space
 * filter - only elements matching the selectors or their children will trigger the event
 * this - an object used as `this` for the handler
 * handler - *required* - a function or a name of the method of *this*
 * options - an object containing any of:
    * capture - see MDN
    * once - must trigger only once
    * passive - will not call `preventDefault()`
    * prevent - call `preventDefault()` before handler
    * stop - call `stopPropagation()` before handler

The return value is a function that, when called, will remove the handler.

Note that `removeEventListener()` called with the passed handler may not work
due to handler being wrapped with additional code.

## Feedback

If you think there's something wrong or something is missing,
please contact me :)

 * [Issue tracker](https://bitbucket.org/verypositive/dtk/issues)
 * [Email](mailto:danko@very.lv)

## License

MIT
