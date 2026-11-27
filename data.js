// Global Bitcoin & Sovereign Compute — node dataset. Per-field provenance: see SOURCES at the bottom (shown in the Almanac).
window.NODES = [
 {id:"US",name:"United States",city:"Austin, TX",lat:30.3,lon:-97.7,price:0.15,hash:35.6,reg:72,clean:43,ai:100,
  pools:["Foundry USA","MARA Pool","Luxor"],dc:["#1 El Capitan (1,809 PF)", "#2 Frontier (1,353 PF)", "#3 Aurora (1,012 PF)", "#5 Microsoft Eagle (561 PF)"],
  wonders:["Rockdale Mega-Mine","Grand Coulee Dam"]},
 {id:"CA",name:"Canada",city:"Montreal, QC",lat:45.5,lon:-73.6,price:0.11,hash:2.34,reg:65,clean:77,ai:45,
  pools:[],dc:["Cohere / Montreal AI hubs"],wonders:["Robert-Bourassa Hydro","Hut 8 Hydro Farms"]},
 {id:"RU",name:"Russia",city:"Irkutsk",lat:52.3,lon:104.3,price:0.104,hash:18.07,reg:40,clean:36,ai:20,
  pools:[],dc:["Yandex DCs"],wonders:["Bratsk Hydro","BitRiver Mega-Site"]},
 {id:"KZ",name:"Kazakhstan",city:"Ekibastuz",lat:51.7,lon:75.3,price:0.078,hash:1.59,reg:45,clean:15,ai:5,
  pools:[],dc:[],wonders:["Ekibastuz GRES-1"]},
 {id:"CN",name:"China",city:"Xinjiang / Sichuan",lat:30.6,lon:104.1,price:0.109,hash:11.69,reg:5,clean:42,ai:85,
  pools:["AntPool","F2Pool","ViaBTC","Binance Pool (ops)"],dc:["#24 Sunway TaihuLight (93 PF)"],
  wonders:["Three Gorges Dam","Sichuan Wet-Season Hydro Farms"]},
 {id:"PY",name:"Paraguay",city:"Hernandarias",lat:-25.4,lon:-54.6,price:0.047,hash:4.78,reg:45,clean:100,ai:2,
  pools:[],dc:[],wonders:["Itaipu Dam"]},
 {id:"ET",name:"Ethiopia",city:"Addis Ababa",lat:9.0,lon:38.7,price:0.019,hash:1.59,reg:40,clean:100,ai:2,
  pools:[],dc:[],wonders:["Grand Ethiopian Renaissance Dam"]},
 {id:"AE",name:"United Arab Emirates",city:"Abu Dhabi",lat:24.5,lon:54.4,price:0.11,hash:2.76,reg:85,clean:32,ai:55,
  pools:[],dc:["#37 Core42 SuperPOD (56 PF)", "#38 Core42 AI-03 (54 PF)"],wonders:["Barakah Nuclear Plant"]},
 {id:"OM",name:"Oman",city:"Muscat",lat:23.6,lon:58.4,price:0.187,hash:2.98,reg:60,clean:5,ai:5,pools:[],dc:[],wonders:[]},
 {id:"NO",name:"Norway",city:"Mo i Rana",lat:66.3,lon:14.1,price:0.117,hash:1.7,reg:55,clean:99,ai:25,
  pools:[],dc:["Stargate Norway (Narvik)"],wonders:["Norwegian Fjord Hydro"]},
 {id:"IS",name:"Iceland",city:"Reykjavik",lat:64.1,lon:-21.9,price:0.088,hash:0.8,reg:60,clean:100,ai:10,
  pools:[],dc:["Verne Global"],wonders:["Hellisheidi Geothermal"]},
 {id:"SE",name:"Sweden",city:"Boden",lat:65.8,lon:21.7,price:0.06,hash:0.8,reg:55,clean:99,ai:20,pools:[],dc:["Meta Luleå"],wonders:[]},
 {id:"DE",name:"Germany",city:"Frankfurt",lat:50.1,lon:8.7,price:0.284,hash:1.0,reg:70,clean:59,ai:45,pools:[],dc:["#4 JUPITER Booster (1,000 PF)", "#48 JUWELS Booster (44 PF)"],wonders:[]},
 {id:"FI",name:"Finland",city:"Hamina",lat:60.6,lon:27.2,price:0.122,hash:0.5,reg:60,clean:96,ai:25,pools:[],dc:["#9 LUMI (380 PF)"],wonders:["Olkiluoto 3"]},
 {id:"FR",name:"France",city:"Paris",lat:48.9,lon:2.35,price:0.186,hash:0.3,reg:65,clean:95,ai:50,pools:[],dc:["#26 CEA-HE (91 PF)", "#40 Jean Zay H100 (52 PF)"],wonders:["Gravelines Nuclear"]},
 {id:"GB",name:"United Kingdom",city:"London",lat:51.5,lon:-0.1,price:0.444,hash:0.2,reg:60,clean:64,ai:55,pools:[],dc:["#11 Isambard-AI (217 PF)", "#31 Northern Data Njoerd (78 PF)"],wonders:[]},
 {id:"SV",name:"El Salvador",city:"San Salvador",lat:13.7,lon:-89.2,price:0.225,hash:0.1,reg:95,clean:87,ai:1,pools:[],dc:[],wonders:["Volcano Geothermal Mining"]},
 {id:"BT",name:"Bhutan",city:"Thimphu",lat:27.5,lon:89.6,price:0.019,hash:1.0,reg:70,clean:100,ai:1,pools:[],dc:[],wonders:["Druk Sovereign Hydro Mines"]},
 {id:"JP",name:"Japan",city:"Tokyo",lat:35.7,lon:139.7,price:0.2,hash:0.5,reg:70,clean:33,ai:55,pools:[],dc:["#7 Fugaku (442 PF)", "#16 ABCI 3.0 (145 PF)", "#17 SoftBank CHIE-4 (135 PF)"],wonders:[]},
 {id:"KR",name:"South Korea",city:"Seoul",lat:37.6,lon:127.0,price:0.119,hash:0.1,reg:50,clean:40,ai:45,pools:[],dc:["#21 Samsung SSC-24 (106 PF)", "#57 NAVER Sejong (33 PF)"],wonders:[]},
 {id:"TW",name:"Taiwan",city:"Hsinchu",lat:24.8,lon:121.0,price:0.191,hash:0.1,reg:55,clean:13,ai:60,pools:[],dc:["#29 NCHC Nano 4 (82 PF)"],wonders:["TSMC Gigafabs"]},
 {id:"SG",name:"Singapore",city:"Singapore",lat:1.35,lon:103.8,price:0.261,hash:0.1,reg:70,clean:5,ai:40,pools:[],dc:["Singapore DC cluster"],wonders:[]},
 {id:"IN",name:"India",city:"Mumbai",lat:19.1,lon:72.9,price:0.122,hash:0.3,reg:30,clean:27,ai:35,pools:[],dc:["#28 Yotta Shakti Cloud (84 PF)"],wonders:[]},
 {id:"SA",name:"Saudi Arabia",city:"Riyadh",lat:24.7,lon:46.7,price:0.07,hash:0.3,reg:40,clean:2,ai:45,pools:[],dc:["#18 KAUST Shaheen III GPU (123 PF)"],wonders:[]},
 {id:"BR",name:"Brazil",city:"São Paulo",lat:-23.5,lon:-46.6,price:0.134,hash:0.5,reg:60,clean:89,ai:15,pools:[],dc:["#36 Petrobras Harpia (57 PF)"],wonders:[]},
 {id:"AR",name:"Argentina",city:"Neuquén",lat:-38.9,lon:-68.1,price:0.098,hash:0.32,reg:55,clean:42,ai:3,pools:[],dc:[],wonders:["Vaca Muerta Flare-Gas Mining"]},
 {id:"AU",name:"Australia",city:"Sydney",lat:-33.9,lon:151.2,price:0.244,hash:1.0,reg:60,clean:39,ai:25,pools:[],dc:[],wonders:[]},
 {id:"MY",name:"Malaysia",city:"Johor",lat:1.5,lon:103.7,price:0.129,hash:0.74,reg:35,clean:21,ai:35,pools:[],dc:["Johor AI DC corridor"],wonders:[]},
 {id:"ZA",name:"South Africa",city:"Johannesburg",lat:-26.2,lon:28.0,price:0.108,hash:0.2,reg:50,clean:18,ai:5,pools:[],dc:[],wonders:[]},
 {id:"KE",name:"Kenya",city:"Nairobi",lat:-1.3,lon:36.8,price:0.175,hash:0.1,reg:45,clean:90,ai:2,pools:[],dc:[],wonders:["Olkaria Geothermal"]},
 {id:"ID",name:"Indonesia",city:"Sumatra",lat:-0.9,lon:100.4,price:0.069,hash:2.13,reg:45,clean:18,ai:15,pools:[],dc:[],wonders:[]},
 {id:"PK",name:"Pakistan",city:"Islamabad",lat:33.7,lon:73.1,price:0.152,hash:0.85,reg:55,clean:55,ai:3,pools:[],dc:[],wonders:[]},
 {id:"VE",name:"Venezuela",city:"Caracas",lat:10.5,lon:-66.9,price:0.081,hash:1.06,reg:30,clean:91,ai:1,pools:[],dc:[],wonders:["Guri Dam"]},
 {id:"KG",name:"Kyrgyzstan",city:"Bishkek",lat:42.9,lon:74.6,price:0.04,hash:0.43,reg:50,clean:85,ai:1,pools:[],dc:[],wonders:["Toktogul Dam"]},
 {id:"BO",name:"Bolivia",city:"La Paz",lat:-16.5,lon:-68.1,price:0.07,hash:0.43,reg:40,clean:36,ai:1,pools:[],dc:[],wonders:[]},
 {id:"IR",name:"Iran",city:"Tehran",lat:35.7,lon:51.4,price:0.01,hash:0.32,reg:20,clean:6,ai:5,pools:[],dc:[],wonders:[]}
];

window.DATA_ASOF="Q4 2026";
window.NETWORK_EH=941;
window.HASH_VERIFIED=["US", "RU", "CN", "PY", "OM", "AE", "CA", "ID", "NO", "ET", "KZ", "VE", "PK", "MY", "KG", "BO", "AR", "IR"];
window.PRICE_VERIFIED=["US", "CA", "RU", "KZ", "CN", "PY", "ET", "AE", "OM", "NO", "IS", "DE", "FI", "FR", "GB", "SV", "BT", "JP", "KR", "TW", "SG", "IN", "SA", "BR", "AR", "AU", "MY", "ZA", "KE", "ID", "PK", "VE", "KG"];
window.CLEAN_VERIFIED=["US", "CA", "RU", "KZ", "CN", "PY", "ET", "AE", "OM", "NO", "IS", "SE", "DE", "FI", "FR", "GB", "SV", "BT", "JP", "KR", "TW", "SG", "IN", "SA", "BR", "AR", "AU", "MY", "ZA", "KE", "ID", "PK", "VE", "KG", "BO", "IR"];
window.TOP500=["US", "DE", "JP", "FI", "GB", "SA", "KR", "CN", "FR", "IN", "TW", "BR", "AE"];
window.SOURCES=[
 {f:"BTC hashrate share & EH/s",s:"Hashrate Index — Global Hashrate Heatmap Q4 2026 (CBECI-style pool geolocation)",u:"https://hashrateindex.com/blog/global-hashrate-heatmap-update-q4-2026-c/",st:"Verified · 18 countries"},
 {f:"Hashrate geolocation method",s:"Cambridge CBECI Mining Map",u:"https://ccaf.io/cbnsi/cbeci/mining_map",st:"Methodology"},
 {f:"Business electricity price",s:"GlobalPetrolPrices — business rate, 2023–2026 average, Q3 2026 update",u:"https://www.globalpetrolprices.com/electricity_prices/?type=business",st:"Verified · 33 countries"},
 {f:"Low-carbon electricity share",s:"Our World in Data energy dataset (Ember / Energy Institute), latest year 2024–2025",u:"https://github.com/owid/energy-data",st:"Verified · 36 countries"},
 {f:"Supercomputers",s:"TOP500 list, November 2025 (ranks 1–65)",u:"https://www.top500.org/lists/top500/list/2025/11/",st:"Verified · 13 countries"},
 {f:"Mining pools / AI campuses",s:"mempool.space mining dashboard; operator announcements",u:"https://mempool.space/mining",st:"Reference"},
 {f:"Regulation & AI compute index",s:"Editorial 0–100 index for this map",u:"",st:"Editorial"},
 {f:"Coastlines",s:"Natural Earth 1:110m land (public domain)",u:"https://www.naturalearthdata.com/",st:"Verified"}
];
