import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
const login=process.env.DATAFORSEO_LOGIN, pw=process.env.DATAFORSEO_PASSWORD;
const auth="Basic "+Buffer.from(`${login}:${pw}`).toString("base64");
const res=await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live",{
  method:"POST",headers:{Authorization:auth,"Content-Type":"application/json"},
  body:JSON.stringify([{target:"aversusb.net",location_code:2840,language_code:"en",limit:1000,
    filters:[["ranked_serp_element.serp_item.rank_group","<=",30]],
    order_by:["keyword_data.keyword_info.search_volume,desc"]}])});
const j=await res.json();
const items=(j.tasks?.[0]?.result?.[0]?.items||[]).map(it=>({
  kw:it.keyword_data?.keyword, vol:it.keyword_data?.keyword_info?.search_volume||0,
  pos:it.ranked_serp_element?.serp_item?.rank_group||0,
  url:(it.ranked_serp_element?.serp_item?.url||"").replace("https://www.aversusb.net","").replace("https://aversusb.net","")}));
const want=["audi","luxury","ps5 pro","xbox series x","browns","jbl","bose","amazon music","youtube music","bloomberg","wsj","chick","popeyes"];
console.log("MATCHING KEYWORDS (pos<=30):");
for(const w of want){
  const m=items.filter(i=>i.kw?.includes(w));
  m.forEach(i=>console.log(`  pos${String(i.pos).padStart(2)} vol${String(i.vol).padStart(5)} "${i.kw}" -> ${i.url}`));
}
console.log("\nTOTAL pos<=10:", items.filter(i=>i.pos<=10).length, "| pos 11-20:", items.filter(i=>i.pos>=11&&i.pos<=20).length);
