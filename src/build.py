import os, re
# Сборка «Сигнала» из исходников: index.html + style.css + prod_signal.js + lib.js + art.js + app.js
# (<!--V-->…<!--/V--> — части «Сигнала», <!--L-->…<!--/L--> — части «Экрана», здесь вырезаются)
d = os.path.dirname(os.path.abspath(__file__)) + '/'
R = lambda f: open(d + f, encoding='utf-8').read()
prod = R('prod_signal.js'); c = lambda n: re.search(n + r"\s*=\s*'([^']*)'", prod).group(1)
h = re.sub(r'<!--L-->.*?<!--/L-->', '', R('index.html'), flags=re.S).replace('<!--V-->', '').replace('<!--/V-->', '')
icon = '<svg viewBox="0 0 16 16" width="20" height="20"><path d="M1 8h4l2-5 2 10 2-5h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
for k, v in {'APP_NAME': c('APP_NAME'), 'APP_TAG': c('APP_TAG'), 'SITE': c('SITE_URL'), 'ICON': icon, 'BODY': ''}.items(): h = h.replace('{{%s}}' % k, v)
h = h.replace('/*CSS*/', R('style.css')).replace('/*JS*/', prod + '\n' + R('lib.js') + '\n' + R('art.js') + '\n' + R('app.js'))
open(d + '../index.html', 'w', encoding='utf-8').write(h.replace('<title>', '<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon-192.png">\n<link rel="apple-touch-icon" href="icon-180.png">\n<meta name="theme-color" content="#1f6feb">\n<title>', 1))
print('Сигнал', c('APP_VERSION'))
