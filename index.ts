import {UrlComp} from "./lib/UrlComp";

export
function url_compute(relative_url: string, base_url: string) {
    let murl = new UrlComp(relative_url, base_url);
    return murl.get_full();
}