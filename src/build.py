# Сборка index.html (в корень репозитория) из исходников этой папки
import os
d=os.path.dirname(os.path.abspath(__file__))+'/'
h=open(d+'index.html').read()
h=h.replace('/*CSS*/',open(d+'style.css').read()).replace('/*JS*/',open(d+'lib.js').read()+'\n'+open(d+'app.js').read())
h=h.replace('<title>','<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon-192.png">\n<link rel="apple-touch-icon" href="icon-180.png">\n<meta name="theme-color" content="#1f6feb">\n<title>',1)
open(d+'../index.html','w').write(h)
