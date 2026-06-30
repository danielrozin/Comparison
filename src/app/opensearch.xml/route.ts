import { NextResponse } from "next/server";

const SITE_URL = "https://www.aversusb.net";
const SITE_NAME = "A Versus B";

// OpenSearch 1.1 descriptor — lets browsers (Firefox, Chrome, Safari, Edge)
// add aversusb.net as a search engine in the address bar.
// Spec: https://github.com/dewitt/opensearch/blob/master/opensearch-1-1-draft-6.md
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>${SITE_NAME}</ShortName>
  <Description>Compare anything — products, brands, countries, ideas — on A Versus B.</Description>
  <Tags>compare comparison versus vs</Tags>
  <Contact>daniarozin@gmail.com</Contact>
  <Language>en-us</Language>
  <OutputEncoding>UTF-8</OutputEncoding>
  <InputEncoding>UTF-8</InputEncoding>
  <AdultContent>false</AdultContent>
  <Image width="16" height="16" type="image/x-icon">${SITE_URL}/favicon.ico</Image>
  <Image width="64" height="64" type="image/png">${SITE_URL}/icon-64.png</Image>
  <Url type="text/html" method="get"
       template="${SITE_URL}/search?q={searchTerms}" />
  <Url type="application/json" method="get"
       template="${SITE_URL}/api/search?q={searchTerms}&amp;limit=10" />
  <Url type="application/opensearchdescription+xml" rel="self"
       template="${SITE_URL}/opensearch.xml" />
  <moz:SearchForm>${SITE_URL}/search</moz:SearchForm>
  <Query role="example" searchTerms="iPhone vs Samsung" />
</OpenSearchDescription>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
