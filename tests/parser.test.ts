
import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";

import { Parser } from '../parser.ts';

const parser = new Parser('https://example.com');

Deno.test({
    name: 'getCanonicalHrefs handles quoted and unquoted hrefs',
    fn: () => {
        const input = `
            <a href='https://example.com/1'>1</a>
            <a href="https://example.com/2">2</a>
            <a href=https://example.com/3>3</a>
        `;
        const expected: string[] = [
            'https://example.com/1',
            'https://example.com/2',
            'https://example.com/3'
        ]
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores self links',
    fn: () => {
        const input = `
            <a href=https://example.com>naked</a>
            <a href=https://example.com/>trailing slash</a>
        `;
        const expected: string[] = [];
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores zero length hrefs',
    fn: () => {
        const input = `
            <a href=>zero</a>
        `;
        const expected: string[] = [];
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores anchor links',
    fn: () => {
        const input = `
            <a href=#foo>naked anchor</a>
            <a href=https://example.com#foo>qualified anchor</a>
            <a href=https://example.com/deep/link#foo>deep qualified anchor</a>
        `;
        const expected: string[] = ['https://example.com/deep/link'];
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores querystring',
    fn: () => {
        const input = `
            <a href=?foo>naked querystring</a>
            <a href=https://example.com?foo>qualified querystring</a>
            <a href=https://example.com/deep/link?foo>deep querystring</a>
        `;
        const expected: string[] = ['https://example.com/deep/link'];
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores non-https schemes',
    fn: () => {
        const input = `
            <a href=tel:08005551234>phone</a>
            <a href=email:person@example.com>email</a>
        `;
        const expected: string[] = [];
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores external links',
    fn: () => {
        const input = `
            <a href=https://not-exxample.com>external site</a>
        `;
        const expected: string[] = [];
        assertEquals(expected, parser.getURLs(input));
    }
});

Deno.test({
    name: 'getCanonicalHrefs ignores href trailing space',
    fn: () => {
        const input = `
            <a href=https://example.com/foo attr=value>complicated anchor tag</a>
        `;
        const expected: string[] = ['https://example.com/foo'];
        assertEquals(expected, parser.getURLs(input));
    }
});
