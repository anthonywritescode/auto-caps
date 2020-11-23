// ==UserScript==
// @name         auto-caps
// @namespace    https://asottile.dev
// @version      0.1
// @author       asottile
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

// TODO:
// - if we backspace immediately after sending a capital, un-capital it
// - (MAYBE) make sure the ^Z works to do the same for uncaps

(function() {

    function keydown(e) {
        console.log('keydown');

        if (
            e.target.tagName !== 'TEXTAREA' &&
            (e.target.tagName !== 'INPUT' || e.target.type !== 'text')
        ) {
            console.log('skipping: not TEXTAREA/INPUT[type=text]');
            return;
        } else if (e.ctrlKey || e.altKey || e.shiftKey) {
            console.log('skipping: ctrl / alt / shift');
            return;
        }

        let pos = e.target.selectionStart;
        let end = e.target.selectionEnd;
        if (
            e.key.match(/^[a-z]$/) && (
                pos === 0 || (
                    pos >= 1 &&
                    e.target.value[pos - 1] === '\n'
                ) || (
                    pos >= 2 &&
                    e.target.value[pos - 1] === ' ' &&
                    e.target.value[pos - 2].match(/[.?!\-]/)
                ) || (
                    pos >= 3 &&
                    e.target.value[pos - 1] === ' ' &&
                    e.target.value[pos - 2] === ' ' &&
                    e.target.value[pos - 3].match(/[.?!]/)
                )
            )
        ) {
            e.target.value = (
                e.target.value.slice(0, pos) +
                e.key.toUpperCase() +
                e.target.value.slice(end)
            );
            e.target.selectionStart = e.target.selectionEnd = pos + 1;
            e.preventDefault();
        }

        if (
            e.target.selectionStart == e.target.selectionEnd &&
            e.key === ' ' &&
            pos >= 2 &&
            e.target.value[pos - 1] === ' ' &&
            !e.target.value[pos - 2].match(/[.?! ]/)
        ) {
            e.target.value = (
                e.target.value.slice(0, pos - 1) +
                '. ' +
                e.target.value.slice(pos)
            );
            e.target.selectionStart = e.target.selectionEnd = pos + 1;
            e.preventDefault();
        }
    }

    document.body.addEventListener('keydown', keydown);
})();
