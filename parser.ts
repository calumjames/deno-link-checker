
export class Parser {

    domain: string;
    excludes: string[];
    readonly hrefRegex = /href\s*=\s*(?:[\'\"]*)([^\s\>\'\"\#\?]*)(?:[\'\"\s]*)/g;
    readonly extensionsToIgnore = ['PNG', 'SVG', 'ICO', 'CSS', 'RDF', 'WOFF2', 'ASPX'];

    constructor(domain: string, excludes?: string[]) {
        this.domain = domain;
        this.excludes = [];
        if (excludes) {
            for (const rawExclude of excludes) {
                const cleanExclude = this.cleanURL(rawExclude);
                if (cleanExclude) this.excludes.push(cleanExclude);
            }
        }
    }

    getURLs(input: string): string[] {
        const matches = input.matchAll(this.hrefRegex);
        let output: string[] = [];
        for (const match of matches) {
            const href = this.cleanURL(match[1]);
            if (href && !this.isExcluded(href)) output.push(href);
        }
        // Make unique and sort alphabetically
        output = [...new Set(output)].sort();
        return output;
    }

    cleanURL(url: string): string | null {
        // Reject empty URLs
        if (url === '') return null;
        if (url === '/') return null;
        // Fix naked URLs
        url = url.startsWith('/') ? this.domain.replace(/\/+$/, '') + url : url;
        // Reject URLs same as domain
        if (url === this.domain) return null;
        if (url === this.domain + '/') return null;
        // Reject non-HTTP schemas
        if (url.startsWith('tel:')) return null;
        if (url.startsWith('email:')) return null;
        if (url.startsWith('data:')) return null;

        // Reject external URLs
        //if (!url.startsWith(this.domain)) return null;

        // URL is clean
        return url.replaceAll("//", "/").toLowerCase().replace('http:/', 'http://').replace('http:///', 'http://').replace('https:/', 'https://').replace('https:///', 'https://')
    }

    isExcluded(url: string): boolean {
        const urlEndsWithExtensionToIgnore = this.extensionsToIgnore.some(extension => {
            return url.toLowerCase().endsWith(extension.toLowerCase());
        });

        if (urlEndsWithExtensionToIgnore) {
            return true;
        }

        for (const exclude of this.excludes) {
            if (url.toLowerCase().startsWith(exclude)) return true;
        }
        return false;
    }

}