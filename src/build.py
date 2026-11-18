import os
d=os.path.dirname(os.path.abspath(__file__))+'/'
h=open(d+'index.html').read()
h=h.replace('/*CSS*/',open(d+'style.css').read()).replace('/*JS*/',open(d+'lib.js').read()+'\n'+open(d+'art.js').read()+'\n'+open(d+'app.js').read())
os.makedirs(d+'../dist',exist_ok=True)
# окно Claude: база с фото встроена прямо в страницу (загрузить файл рядом там нельзя)
dj=d+'../../signalflow/devices.json'
emb=h.replace('</body>','<script id="sfDefaults" type="application/json">'+open(dj).read().replace('</','<\\/')+'</script>\n</body>',1) if os.path.exists(dj) else h
open(d+'../dist/index.html','w').write(emb)
gh=h.replace('<title>','<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon-192.png">\n<link rel="apple-touch-icon" href="icon-180.png">\n<meta name="theme-color" content="#1f6feb">\n<title>',1)
os.makedirs(d+'../gh',exist_ok=True)
open(d+'../gh/index.html','w').write(gh)
