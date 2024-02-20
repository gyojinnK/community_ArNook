import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const links = [
    { url: "/main", changefreq: "always", priority: 0.7 },
    { url: "/userView", changefreq: "always", priority: 0.7 },
    { url: "/detail", changefreq: "always", priority: 0.5 },
    { url: "/otherDetail", changefreq: "always", priority: 0.5 },
    { url: "/posting", changefreq: "never", priority: 0.5 },
];

const sitemap = new SitemapStream({
    hostname: "https://d3m8ut08h35g18.cloudfront.net/",
});

links.forEach((link) => {
    sitemap.write(link);
});

sitemap.end();

streamToPromise(sitemap).then((sitemap) => {
    createWriteStream("./public/sitemap.xml").write(sitemap);
});
