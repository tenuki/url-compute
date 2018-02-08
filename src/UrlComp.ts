export
function is_absolute(a_path: string) {
    return a_path.startsWith("/");
}

export
function upper_path_walk(path: string) {
    let min = 0;
    let isabs = is_absolute(path);
    let upper = "..";
    let parts = path.split("/");
    let last = parts.indexOf(upper);
    while (last > min) {
        if (parts[last - 1].localeCompare(upper) != 0 || isabs) {
            let new_parts = parts.slice(0, last - 1);
            if (last <= 2 && parts[0].length == 0) {
                new_parts = [''];
            }
            parts = new_parts.concat(parts.slice(last + 1));
        } else {
            min += 1;
        }
        last = parts.lastIndexOf(upper);
    }

    let result = parts.reduce(function (a, b) {
        //if (a==null) {a=""} else {a=a+"/";}return a + b; 
        if (a == null) {
            return b
        }
        return a + "/" + b;
    }, null);
    return result;
}


export
class UrlComp {
    constructor(public urldef: string, public base?: string) {
    }

    have_scheme() {
        return this.urldef.indexOf("://") != -1;
    }

    is_absolute() {
        return is_absolute(this.urldef);
    }

    get_scheme() {
        let start = this.urldef.indexOf("://");
        return this.urldef.slice(0, this.urldef.indexOf("://") + 3);
    }

    get_host() {
        let start = this.urldef.indexOf("://") + 3;
        return this.urldef.slice(
            start, this.urldef.indexOf("/", start)
        );
    }

    get_path() {
        let tmp;
        if (this.have_scheme()) {
            let host = this.get_host();
            tmp = this.urldef.slice(
                this.urldef.indexOf(host) + host.length);
        } else {
            //shall we detect host/path.../..  case?
            tmp = this.urldef;
        }
        return tmp;
    }

    get_path_wo_filename() {
        let path = this.get_path();
        while (!path.endsWith("/") && path.length) {
            path = path.slice(0, path.length - 1);
        }
        return path;
    }

    get_full() {
        if (this.have_scheme()) {
            return this.urldef;
        }

        let baseurl = new UrlComp(this.base);
        let base_host = baseurl.get_scheme() + baseurl.get_host();

        if (this.is_absolute()) {
            return base_host + this.urldef;
        }

        let base_path = baseurl.get_path_wo_filename();
        let result = base_host + base_path + this.urldef;
        return upper_path_walk(result);
    }
}