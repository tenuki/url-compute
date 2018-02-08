const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

import { url_compute } from "../../src/index";
import { is_absolute, upper_path_walk, UrlComp } from "../../src/UrlComp";

suite('index', () => {
    test('url_compute', () => {
        let url_full = "http://example.com/index.html";
        let url_dir = "http://example.com/dir/index.html";

        assert.strictEqual( url_compute("some_file.txt", url_full), "http://example.com/some_file.txt",
            "full url - single filename on root" );

        assert.strictEqual( url_compute("some_file.txt", url_dir), "http://example.com/dir/some_file.txt",
            "full url - single filename on dir" );

        assert.strictEqual( url_compute("/some_file.txt", url_dir), "http://example.com/some_file.txt",
            "full url - absolute file" );

        assert.strictEqual( url_compute("../some_file.txt", url_dir), "http://example.com/some_file.txt",
            "full url - parent path file" );
    });
});

suite('UrlComp', () => {
    test('basic_functions', () => {
        let url_full = "http://example.com/index.html";
        let url_full2 = "https://example.com/other/path/here/index.html";
        let url3 = "/other/path/here/index.html";
        let url4 = "other/path/here/index.html";
        let UrlComp1 = new UrlComp(url_full);
        let UrlComp2 = new UrlComp(url_full2);
        let UrlComp3 = new UrlComp(url3);
        let UrlComp4 = new UrlComp(url4);

        assert.strictEqual( UrlComp1.get_scheme(), "http://", "get scheme" );
        assert.strictEqual( UrlComp1.get_host(), "example.com", "get host" );
        assert.strictEqual( UrlComp1.get_path(), "/index.html", "get path" );
        assert.strictEqual( UrlComp2.get_scheme(), "https://", "get scheme - 2nd" );
        assert.strictEqual( UrlComp2.get_host(), "example.com", "get host - 2nd" );
        assert.strictEqual( UrlComp2.get_path(), url3, "get path - 2nd" );
        assert.strictEqual( UrlComp3.get_path(), url3, "get path - 3nd" );
        assert.strictEqual( UrlComp4.get_path(), url4, "get path - 4nd" );

        assert.isTrue(UrlComp3.is_absolute(), "absolute test");
        assert.isFalse(UrlComp4.is_absolute(), "absolute test");

        assert.strictEqual( UrlComp3.get_path_wo_filename(), "/other/path/here/", "get path wo filename" );
        assert.strictEqual( UrlComp4.get_path_wo_filename(), "other/path/here/", "get path wo filename - 2nd" );
        assert.strictEqual( (new UrlComp("other/")).get_path_wo_filename(), "other/", "get path wo filename - 3rd" );
        assert.strictEqual( (new UrlComp("other")).get_path_wo_filename(), "", "get path wo filename - 4th" );
        assert.strictEqual( (new UrlComp("/other")).get_path_wo_filename(), "/", "get path wo filename - 5th" );        
    });
    test('upper_walk', () => {
        //upper_path_walk
        let a = "asdf";
        assert.strictEqual( upper_path_walk(a), a, "harmless 1");
        assert.strictEqual( upper_path_walk("/"+a), "/"+a, "harmless 2");
        assert.strictEqual( upper_path_walk(a+"/"), a+"/", "harmless 3");
        assert.strictEqual( upper_path_walk(a+"/"+a), a+"/"+a, "harmless 4");

        assert.strictEqual( upper_path_walk("a/b/../c"), "a/c", "works 1");
        assert.strictEqual( upper_path_walk("/a/../b/../c"), "/c", "works 2");
        assert.strictEqual( upper_path_walk("a/../b/../c"), "c", "works 3");

        assert.strictEqual( upper_path_walk("/a/../b"), "/b", "works 4");
        assert.strictEqual( upper_path_walk("/a/../../b"), "/b", "works 5");
        assert.strictEqual( upper_path_walk("/a/../../../b"), "/b", "works 6");

        assert.strictEqual( upper_path_walk("a/../b"), "b", "works 4b");
        assert.strictEqual( upper_path_walk("a/../../b"), "../b", "works 5b");
        assert.strictEqual( upper_path_walk("a/../../../b"), "../../b", "works 5b");
        assert.strictEqual( upper_path_walk("../b"), "../b", "works 4b");
        assert.strictEqual( upper_path_walk("../../b"), "../../b", "works 4b");
    });
    
    test('url_compute', () => {
        let url_full = "http://example.com/index.html";
        let url_dir = "http://example.com/dir/index.html";

        let UrlComp1 = new UrlComp(url_full);
        assert.strictEqual( UrlComp1.get_full(), url_full, "full url failure" );

        UrlComp1 = new UrlComp("some_file.txt", url_full);
        assert.strictEqual( UrlComp1.get_full(), "http://example.com/some_file.txt", "full url - single filename on root" );

        UrlComp1 = new UrlComp("some_file.txt", url_dir);
        assert.strictEqual( UrlComp1.get_full(), "http://example.com/dir/some_file.txt", "full url - single filename on dir" );

        UrlComp1 = new UrlComp("/some_file.txt", url_dir);
        assert.strictEqual( UrlComp1.get_full(), "http://example.com/some_file.txt", "full url - absolute file" );

        UrlComp1 = new UrlComp("../some_file.txt", url_dir);
        assert.strictEqual( UrlComp1.get_full(), "http://example.com/some_file.txt", "full url - parent path file" );
    });
});

