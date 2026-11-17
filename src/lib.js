// ===================== ТИПЫ СИГНАЛОВ =====================
// fam — семейство (для проверки совместимости), pre — префикс номера кабеля
const T = {
  sdi12g: { n: '12G-SDI', s: 'SDI', fam: 'sdi', rate: 4, c: '#1f6feb', pre: 'V' },
  sdi6g:  { n: '6G-SDI',  s: 'SDI', fam: 'sdi', rate: 3, c: '#3b82f6', pre: 'V' },
  sdi3g:  { n: '3G-SDI',  s: 'SDI', fam: 'sdi', rate: 2, c: '#60a5fa', pre: 'V' },
  sdihd:  { n: 'HD-SDI',  s: 'SDI', fam: 'sdi', rate: 1, c: '#93c5fd', pre: 'V' },
  hdmi:   { n: 'HDMI',    s: 'HDMI', fam: 'hdmi', c: '#ea7a1e', pre: 'H' },
  dp:     { n: 'DisplayPort', s: 'DP', fam: 'dp', c: '#9b51e0', pre: 'D' },
  dvi:    { n: 'DVI',     s: 'DVI', fam: 'dvi', c: '#c084fc', pre: 'D' },
  vga:    { n: 'VGA (аналог)', s: 'VGA', fam: 'vga', c: '#94a3b8', pre: 'D' },
  hdbt:   { n: 'HDBaseT', s: 'HDBT', fam: 'hdbt', c: '#d97706', pre: 'T' },
  cvbs:   { n: 'CVBS (композит)', s: 'CVBS', fam: 'cvbs', c: '#a3a3a3', pre: 'V' },
  fiber:  { n: 'Оптика (видео)', s: 'FIB', fam: 'fiber', c: '#16a34a', pre: 'F' },
  eth:    { n: 'Ethernet (NDI/IP/Dante)', s: 'LAN', fam: 'eth', c: '#0d9488', pre: 'N' },
  sfp:    { n: 'SFP+ 10/25G (ST 2110)', s: 'SFP', fam: 'eth', c: '#0f766e', pre: 'N' },
  ref:    { n: 'Genlock / Ref', s: 'REF', fam: 'ref', c: '#ca8a04', pre: 'R' },
  tc:     { n: 'Timecode LTC', s: 'TC', fam: 'tc', c: '#a16207', pre: 'R' },
  aud:    { n: 'Аудио аналог (XLR/Jack)', s: 'AUD', fam: 'aud', c: '#dc2626', pre: 'A' },
  aes:    { n: 'AES/EBU', s: 'AES', fam: 'aes', c: '#e11d48', pre: 'A' },
  madi:   { n: 'MADI', s: 'MADI', fam: 'madi', c: '#be123c', pre: 'A' },
  usb:    { n: 'USB', s: 'USB', fam: 'usb', c: '#475569', pre: 'U' },
  ctrl:   { n: 'RS-422/232 управление', s: 'RS', fam: 'ctrl', c: '#64748b', pre: 'C' },
  gpio:   { n: 'GPIO / Tally', s: 'GPIO', fam: 'gpio', c: '#84cc16', pre: 'G' },
  pwr:    { n: 'Питание', s: 'PWR', fam: 'pwr', c: '#111827', pre: 'P' },
};
const TYPE_KEYS = Object.keys(T);

// Совместимость: 2 — ок, 1 — предупреждение, 0 — нужен конвертер
function compat(a, b) {
  if (a === b) return [2, ''];
  const A = T[a], B = T[b];
  if (!A || !B) return [0, 'Неизвестный тип'];
  if (A.fam === 'sdi' && B.fam === 'sdi') {
    return A.rate <= B.rate ? [2, ''] : [1, `${A.n} → вход ${B.n}: вход может не принять такой формат`];
  }
  if (A.fam === B.fam) return [1, `${A.n} ↔ ${B.n}: проверьте скорость/модуль`];
  const pair = [A.fam, B.fam].sort().join('+');
  if (pair === 'dvi+hdmi') return [1, 'HDMI ↔ DVI: нужен пассивный переходник, звука не будет'];
  if (pair === 'dp+hdmi' && A.fam === 'dp') return [1, 'DP → HDMI: нужен переходник (DP++)'];
  return [0, `${A.n} → ${B.n}: нужен конвертер`];
}

// ===================== КАТЕГОРИИ =====================
const CATS = {
  cam:  { n: 'Камеры', pre: 'CAM', c: '#2563eb', ic: 'cam' },
  ccu:  { n: 'CCU / базовые станции', pre: 'CCU', c: '#1d4ed8', ic: 'rack' },
  sw:   { n: 'Видеомикшеры', pre: 'SW', c: '#7c3aed', ic: 'sw' },
  proc: { n: 'Презентационные процессоры', pre: 'PRC', c: '#6d28d9', ic: 'sw' },
  rt:   { n: 'Матрицы / роутеры', pre: 'RTR', c: '#9333ea', ic: 'grid' },
  conv: { n: 'Конвертеры', pre: 'CNV', c: '#0891b2', ic: 'conv' },
  da:   { n: 'Распределители / сплиттеры', pre: 'DA', c: '#0e7490', ic: 'da' },
  ext:  { n: 'Удлинители / оптика', pre: 'EXT', c: '#15803d', ic: 'ext' },
  mon:  { n: 'Мониторы / экраны / проекторы', pre: 'MON', c: '#334155', ic: 'mon' },
  mv:   { n: 'Мультивьюеры', pre: 'MV', c: '#475569', ic: 'mv' },
  led:  { n: 'LED-процессоры и экраны', pre: 'LED', c: '#db2777', ic: 'led' },
  rec:  { n: 'Запись / плейбек', pre: 'REC', c: '#b91c1c', ic: 'rec' },
  nb:   { n: 'Ноутбуки', pre: 'NB', c: '#1e293b', ic: 'nb' },
  pc:   { n: 'Компьютеры / медиасерверы', pre: 'PC', c: '#0f172a', ic: 'pc' },
  enc:  { n: 'Стриминг / NDI / энкодеры', pre: 'ENC', c: '#0d9488', ic: 'enc' },
  net:  { n: 'Сеть', pre: 'NET', c: '#115e59', ic: 'net' },
  sync: { n: 'Синхронизация', pre: 'SYNC', c: '#a16207', ic: 'sync' },
  aud:  { n: 'Звук', pre: 'AUD', c: '#be123c', ic: 'aud' },
  ctl:  { n: 'Управление / tally / интерком', pre: 'CTL', c: '#4d7c0f', ic: 'ctl' },
  pp:   { n: 'Патч-панели / прочее', pre: 'PP', c: '#57534e', ic: 'pp' },
  my:   { n: 'Мои устройства', pre: 'DEV', c: '#0369a1', ic: 'star' },
};

// ===================== ИКОНКИ (16x16) =====================
const ICONS = {
  cam: 'M2 5h8v6H2zM10 7l4-2v6l-4-2z',
  rack: 'M2 3h12v4H2zM2 9h12v4H2zM4 5h2M4 11h2',
  sw: 'M1 4h14v8H1zM3 6h2v2H3zM6 6h2v2H6zM9 6h2v2H9zM3 9h8M12 6h2v4h-2z',
  grid: 'M2 2h12v12H2zM2 6h12M2 10h12M6 2v12M10 2v12',
  conv: 'M2 5h5v6H2zM9 5h5v6H9zM7 8h2M8 7l1 1-1 1',
  da: 'M2 7h4M6 8l7-5M6 8h7M6 8l7 5M2 9h4',
  ext: 'M1 8h4M11 8h4M5 6h6v4H5zM7 8h2',
  mon: 'M1 3h14v8H1zM6 14h4M8 11v3',
  mv: 'M1 3h14v9H1zM1 7.5h14M8 3v9',
  led: 'M1 3h14v9H1zM3 5h1M6 5h1M9 5h1M12 5h1M3 8h1M6 8h1M9 8h1M12 8h1M6 14h4',
  rec: 'M1 4h14v8H1zM5 6.5a1.5 1.5 0 1 0 0.01 0M9 7h4M9 9h4',
  pc: 'M2 3h12v8H2zM1 13h14M5 11v2M11 11v2',
  nb: 'M3 3h10v7H3zM1 12h14l-1 2H2z',
  enc: 'M3 9a5 5 0 0 1 10 0M5.5 9a2.5 2.5 0 0 1 5 0M8 9v5',
  net: 'M1 5h14v6H1zM3 7h2v2H3zM6 7h2v2H6zM9 7h2v2H9zM12 7h1v2h-1z',
  sync: 'M8 2a6 6 0 1 0 0.01 0M8 4v4l3 2',
  aud: 'M2 6h3l4-3v10l-4-3H2zM11 5a4 4 0 0 1 0 6M13 3a7 7 0 0 1 0 10',
  ctl: 'M3 2h10v12H3zM6 5a2 2 0 1 0 0.01 0M5 10h6M5 12h6',
  pp: 'M1 5h14v6H1zM3 8a1 1 0 1 0 0.01 0M6 8a1 1 0 1 0 0.01 0M9 8a1 1 0 1 0 0.01 0M12 8a1 1 0 1 0 0.01 0',
  star: 'M8 1.5l2 4.3 4.6.5-3.4 3.1 1 4.6L8 11.7 3.8 14l1-4.6L1.4 6.3 6 5.8z',
};

// ===================== БАЗА УСТРОЙСТВ =====================
// Формат портов: "тип[*кол-во][:Имя]" через запятую. Конфигурации типовые —
// перед проектом сверяйтесь с паспортом устройства (любое можно отредактировать).
const RAW = [
  // --- Камеры
  ['cam', 'Generic', 'Камера SDI', 'ref,sdi3g:Return', 'sdi3g*2'],
  ['cam', 'Generic', 'Камера HDMI', '', 'hdmi'],
  ['cam', 'Generic', 'PTZ-камера NDI', 'eth:LAN/NDI/PoE', 'sdi3g,hdmi'],
  ['cam', 'Sony', 'HDC-3500 (головка)', 'fiber:SMPTE fiber', 'sdi3g:Prompter/Return'],
  ['cam', 'Sony', 'FX6', 'tc:TC IN', 'sdi12g,hdmi'],
  ['cam', 'Sony', 'FX9', 'ref,tc:TC IN', 'sdi12g,sdi3g,hdmi'],
  ['cam', 'Sony', 'FR7 (PTZ)', 'ref,eth:LAN', 'sdi12g,sdi3g,hdmi,fiber:Optical'],
  ['cam', 'Blackmagic', 'URSA Broadcast G2', 'sdi12g:PGM Return,ref,aud*2:XLR', 'sdi12g,sdi3g:Monitor'],
  ['cam', 'Blackmagic', 'Studio Camera 4K Pro G2', 'sdi12g:PGM Return,aud*2:XLR,eth:LAN', 'sdi12g,hdmi'],
  ['cam', 'Blackmagic', 'Pocket Cinema 6K', 'aud:Mini XLR', 'hdmi'],
  ['cam', 'Panasonic', 'AW-UE150', 'ref,eth:LAN/PoE+', 'sdi12g,sdi3g,hdmi,fiber:Optical'],
  ['cam', 'Panasonic', 'AW-UE100', 'ref,eth:LAN/NDI', 'sdi12g,hdmi'],
  ['cam', 'Panasonic', 'AG-CX350', 'tc', 'sdi3g,hdmi'],
  ['cam', 'Canon', 'CR-N500', 'eth:LAN/NDI', 'sdi3g,hdmi'],
  ['cam', 'Canon', 'XF605', 'tc', 'sdi12g,hdmi'],
  ['cam', 'BirdDog', 'P400', 'eth:LAN/NDI/PoE', 'sdi3g,hdmi'],
  ['cam', 'Marshall', 'CV568 (POV)', '', 'sdi3g,hdmi'],
  ['cam', 'GoPro', 'HERO (HDMI)', '', 'hdmi:Media Mod'],
  // --- CCU
  ['ccu', 'Sony', 'HDCU-3500', 'fiber:Camera,ref,sdi3g:Return*1', 'sdi12g*4,eth:LAN'],
  ['ccu', 'Blackmagic', 'URSA Studio Fiber Converter', 'fiber:SMPTE,ref', 'sdi12g*2'],
  ['ccu', 'Blackmagic', 'Studio Fiber Converter', 'fiber:SMPTE,sdi12g:Return,ref', 'sdi12g*2'],
  // --- Видеомикшеры
  ['sw', 'Blackmagic', 'ATEM Mini Pro', 'hdmi*4,aud*2:Mic 3.5', 'hdmi:Out,usb:Webcam,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM Mini Extreme ISO', 'hdmi*8,aud*2:Mic 3.5', 'hdmi*2:Out,usb*2,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM SDI Extreme ISO', 'sdi3g*4,hdmi*4', 'sdi3g:PGM,sdi3g*2:AUX,hdmi:MV,usb,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM Television Studio HD8 ISO', 'sdi3g*8,ref,aud*2:XLR', 'sdi3g:PGM,sdi3g*3:AUX,hdmi:MV,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM Television Studio 4K8', 'sdi12g*8,ref,aud*2:XLR', 'sdi12g:PGM,sdi12g*3:AUX,hdmi:MV,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM 1 M/E Constellation 4K', 'sdi12g*10,ref', 'sdi12g*6:AUX,sdi12g:MV SDI,hdmi:MV HDMI,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM 2 M/E Constellation 4K', 'sdi12g*20,ref', 'sdi12g*12:AUX,sdi12g*2:MV,eth:LAN'],
  ['sw', 'Blackmagic', 'ATEM 4 M/E Constellation 4K', 'sdi12g*40,ref', 'sdi12g*24:AUX,sdi12g*4:MV,eth:LAN'],
  ['sw', 'Roland', 'V-160HD', 'sdi3g*8,hdmi*8,aud*4:XLR', 'sdi3g*3,hdmi*3,usb,eth:LAN'],
  ['sw', 'Roland', 'V-8HD', 'hdmi*8', 'hdmi*3'],
  ['sw', 'Roland', 'V-1HD+', 'hdmi*4', 'hdmi*2'],
  ['sw', 'Ross', 'Carbonite Ultra 1M/E', 'sdi3g*24,ref', 'sdi3g*12:AUX,sdi3g*2:MV,eth:LAN'],
  ['sw', 'Ross', 'Carbonite Black 2M/E', 'sdi3g*36,ref', 'sdi3g*18:AUX,sdi3g*4:MV,eth:LAN'],
  ['sw', 'Sony', 'XVS-G1', 'sdi12g*24,ref', 'sdi12g*12,eth:LAN'],
  ['sw', 'Datavideo', 'SE-1200MU', 'sdi3g*4,hdmi*2', 'sdi3g*2,hdmi*2'],
  ['sw', 'NewTek', 'TriCaster Mini 4K', 'hdmi*4,eth:NDI', 'hdmi*2,eth:LAN'],
  ['sw', 'Generic', 'vMix ПК + DeckLink Quad 2', 'sdi3g*6,eth:NDI/LAN', 'sdi3g*2:Out,hdmi:GUI HDMI,dp:GUI DP'],
  ['sw', 'Generic', 'OBS ПК (захват HDMI)', 'hdmi*2:Capture,eth:LAN', 'hdmi:GUI HDMI,dp:GUI DP'],
  // --- Презентационные процессоры
  ['proc', 'Barco', 'E2 Gen 2 (Event Master, типовая конф.)', 'hdmi*8:HDMI 2.0,dp*4:DP 1.2,sdi12g*8:12G-SDI,ref:Genlock', 'hdmi*8:HDMI Out,sdi12g*4:SDI Out,dp:DP Out,hdmi*4:MVR,ref:Genlock Loop,eth:LAN'],
  ['proc', 'Barco', 'Event Master Ex (Tri-combo)', 'hdmi:HDMI 2.0,dp:DP 1.2,sdi12g*2:12G-SDI,ref:Genlock', 'hdmi:HDMI 2.0 Out,dp:DP Out,sdi12g*2:12G-SDI Out,eth:LAN'],
  ['proc', 'Barco', 'Event Master Ex (пустой, 2 слота)', 'ref:Genlock', 'eth:LAN'],
  ['proc', 'Barco', 'ImagePRO-4K', 'hdmi:HDMI 2.0,dp:DP 1.2,sdi12g*2,ref', 'hdmi:HDMI 2.0 Out,dp:DP Out,sdi12g*2:SDI Out,eth:LAN'],
  ['proc', 'PixelHue', 'Q8 (2 вх. + 2 вых. карты, типовая)', 'hdmi*8:HDMI 2.0,dp*8:DP 1.2,sdi12g*8:12G-SDI,ref:Genlock', 'hdmi*8:HDMI Out,sdi12g*4:SDI Out,fiber*4:OPT,hdmi*2:MVR,eth:LAN,eth:Dante'],
  ['proc', 'PixelHue', 'P20', 'hdmi*8:HDMI/DP,sdi12g*4:12G-SDI', 'hdmi*8:HDMI 2.0 Out,hdmi:MVR,eth:LAN'],
  ['proc', 'PixelHue', 'P10', 'hdmi*4:HDMI/DP', 'hdmi*2:HDMI 2.0 Out,hdmi*6:HDMI 1.3 Out,eth:LAN'],
  ['proc', 'Magnimage', 'LED-550D (550DS с SDI)', 'cvbs*2:AV,vga*2,dvi,hdmi,dp,sdi3g:SDI', 'dvi*2:DVI Out,vga:VGA Out,dvi:DVI Loop,sdi3g:SDI Loop,eth:LAN'],
  ['proc', 'Magnimage', 'LED-W4000', 'sdi3g:SDI,hdmi*3,dvi*4,dp*4', 'dvi*4:DVI A,hdmi*2:HDMI A,dvi*4:DVI B (резерв),hdmi*2:HDMI B (резерв),eth:LAN'],
  ['proc', 'Datapath', 'Fx4', 'dp:DP 1.2,hdmi:HDMI 2.0', 'hdmi*4:Out,eth:LAN'],
  ['proc', 'Barco', 'S3-4K', 'sdi12g*4,hdmi*4,dp*4', 'hdmi*4:HDMI Out,sdi12g*2:SDI Out,eth:LAN'],
  ['proc', 'Analog Way', 'Aquilon RS2 (типовая конф.)', 'sdi12g*8,hdmi*8', 'hdmi*8:Out,eth:LAN'],
  ['proc', 'Analog Way', 'Pulse 4K', 'hdmi*4,dp*2,sdi12g*2', 'hdmi*2:Out,sdi12g:Out,eth:LAN'],
  ['proc', 'Analog Way', 'Picturall Pro', 'hdmi*2', 'dp*8:Out,eth:LAN'],
  ['proc', 'Novastar', 'VX1000 (all-in-one)', 'hdmi*2,dvi*2,sdi3g*2', 'eth*10:Port,hdmi:Monitor,eth:LAN'],
  // --- Матрицы
  ['rt', 'Blackmagic', 'Smart Videohub 12G 40x40', 'sdi12g*40,ref', 'sdi12g*40,eth:LAN'],
  ['rt', 'Blackmagic', 'Videohub 12G 20x20', 'sdi12g*20,ref', 'sdi12g*20,eth:LAN'],
  ['rt', 'Blackmagic', 'Smart Videohub 12G 12x12', 'sdi12g*12,ref', 'sdi12g*12,eth:LAN'],
  ['rt', 'Blackmagic', 'Videohub 10x10 12G', 'sdi12g*10,ref', 'sdi12g*10,eth:LAN'],
  ['rt', 'AJA', 'KUMO 3232-12G', 'sdi12g*32,ref', 'sdi12g*32,eth:LAN'],
  ['rt', 'AJA', 'KUMO 1616-12G', 'sdi12g*16,ref', 'sdi12g*16,eth:LAN'],
  ['rt', 'Generic', 'HDMI матрица 8x8', 'hdmi*8,ctrl', 'hdmi*8,eth:LAN'],
  ['rt', 'Generic', 'HDMI матрица 4x4', 'hdmi*4', 'hdmi*4'],
  ['rt', 'Lightware', 'MX2-8x8-HDMI20', 'hdmi*8', 'hdmi*8,eth:LAN'],
  // --- Конвертеры
  ['conv', 'Blackmagic', 'Micro Converter SDI→HDMI 12G', 'sdi12g', 'sdi12g:Loop,hdmi'],
  ['conv', 'Blackmagic', 'Micro Converter HDMI→SDI 12G', 'hdmi', 'sdi12g*2'],
  ['conv', 'Blackmagic', 'Micro Converter SDI→HDMI 3G', 'sdi3g', 'sdi3g:Loop,hdmi'],
  ['conv', 'Blackmagic', 'Micro Converter HDMI→SDI 3G', 'hdmi', 'sdi3g*2'],
  ['conv', 'Blackmagic', 'Teranex Mini SDI→HDMI 12G', 'sdi12g', 'sdi12g:Loop,hdmi,aud*2:Analog'],
  ['conv', 'Blackmagic', 'Teranex Mini HDMI→SDI 12G', 'hdmi,aud*2:Analog', 'sdi12g'],
  ['conv', 'Blackmagic', 'Teranex AV (кросс-конвертер)', 'sdi12g,hdmi,ref,aud*2', 'sdi12g*2,hdmi'],
  ['conv', 'Blackmagic', 'Mini Converter Audio→SDI', 'sdi3g,aes*2,aud*2', 'sdi3g'],
  ['conv', 'Blackmagic', 'Mini Converter SDI→Audio', 'sdi3g', 'sdi3g:Loop,aes*2,aud*2'],
  ['conv', 'Blackmagic', 'Mini Converter UpDownCross HD', 'sdi3g,hdmi', 'sdi3g*2,hdmi'],
  ['conv', 'Decimator', 'MD-HX (кросс-конвертер)', 'sdi3g,hdmi', 'sdi3g*2,hdmi'],
  ['conv', 'Decimator', 'MD-LX', 'sdi3g,hdmi', 'sdi3g,hdmi'],
  ['conv', 'AJA', 'Hi5-12G (SDI→HDMI)', 'sdi12g', 'hdmi'],
  ['conv', 'AJA', 'HA5-12G (HDMI→SDI)', 'hdmi', 'sdi12g*2'],
  ['conv', 'Generic', 'DP → HDMI переходник', 'dp', 'hdmi'],
  ['conv', 'Generic', 'HDMI → DVI переходник', 'hdmi', 'dvi'],
  ['conv', 'Generic', 'Скалер HDMI→SDI', 'hdmi', 'sdi3g'],
  ['conv', 'Generic', 'Скалер SDI→HDMI', 'sdi3g', 'hdmi'],
  ['conv', 'Generic', 'CVBS→SDI конвертер', 'cvbs', 'sdi3g'],
  ['conv', 'Generic', 'HDMI → DP конвертер', 'hdmi', 'dp'],
  ['conv', 'Generic', 'VGA → HDMI скалер', 'vga,aud:Audio In', 'hdmi'],
  ['conv', 'Generic', 'HDMI → VGA конвертер', 'hdmi', 'vga,aud:Audio Out'],
  ['conv', 'Generic', 'Эмулятор EDID HDMI', 'hdmi', 'hdmi'],
  // --- DA
  ['da', 'Blackmagic', 'Mini Converter SDI Distribution 4K', 'sdi12g', 'sdi12g*8'],
  ['da', 'Blackmagic', 'Mini Converter SDI Distribution 3G', 'sdi3g', 'sdi3g*8'],
  ['da', 'Generic', 'HDMI сплиттер 1x2', 'hdmi', 'hdmi*2'],
  ['da', 'Generic', 'HDMI сплиттер 1x4', 'hdmi', 'hdmi*4'],
  ['da', 'Generic', 'HDMI сплиттер 1x8', 'hdmi', 'hdmi*8'],
  ['da', 'Generic', 'HDMI 2.0 сплиттер 1x4 (4K60)', 'hdmi:HDMI 2.0', 'hdmi*4:HDMI 2.0'],
  ['da', 'Generic', 'DP MST хаб 1x3', 'dp', 'dp*3'],
  ['da', 'Generic', 'SDI DA 1x4', 'sdi3g', 'sdi3g*4'],
  ['da', 'Generic', 'Genlock DA 1x6', 'ref', 'ref*6'],
  // --- Удлинители
  ['ext', 'Generic', 'HDBaseT TX', 'hdmi', 'hdbt,hdmi:Loop'],
  ['ext', 'Generic', 'HDBaseT RX', 'hdbt', 'hdmi'],
  ['ext', 'Generic', 'HDMI по оптике TX', 'hdmi', 'fiber'],
  ['ext', 'Generic', 'HDMI по оптике RX', 'fiber', 'hdmi'],
  ['ext', 'Blackmagic', 'Mini Converter Optical Fiber 12G', 'sdi12g:SDI In,fiber:Fiber In', 'sdi12g*2:SDI Out,fiber:Fiber Out'],
  ['ext', 'AJA', 'FiDO-T-12G (SDI→оптика)', 'sdi12g', 'fiber'],
  ['ext', 'AJA', 'FiDO-R-12G (оптика→SDI)', 'fiber', 'sdi12g*2'],
  ['ext', 'Generic', 'Оптический кросс 12 портов', 'fiber*12', 'fiber*12'],
  ['ext', 'Generic', 'HDMI 2.0 4K по оптике TX', 'hdmi:HDMI 2.0', 'fiber,hdmi:Loop'],
  ['ext', 'Generic', 'HDMI 2.0 4K по оптике RX', 'fiber', 'hdmi:HDMI 2.0'],
  ['ext', 'Generic', 'KVM-удлинитель TX (HDMI+USB)', 'hdmi,usb', 'hdbt:HDBaseT/LAN'],
  ['ext', 'Generic', 'KVM-удлинитель RX (HDMI+USB)', 'hdbt:HDBaseT/LAN', 'hdmi,usb'],
  ['ext', 'Generic', 'DP по оптике TX', 'dp', 'fiber'],
  ['ext', 'Generic', 'DP по оптике RX', 'fiber', 'dp'],
  // --- Мониторы
  ['mon', 'Generic', 'Монитор SDI', 'sdi3g', 'sdi3g:Loop'],
  ['mon', 'Generic', 'Телевизор / монитор HDMI', 'hdmi', ''],
  ['mon', 'Generic', 'Монитор ПК (DP/HDMI)', 'dp,hdmi', ''],
  ['mon', 'Generic', 'Проектор', 'hdmi,hdbt', ''],
  ['mon', 'Generic', 'Суфлёр (HDMI/SDI)', 'hdmi,sdi3g', ''],
  ['mon', 'Blackmagic', 'SmartView 4K G2', 'sdi12g*2', 'sdi12g:Loop,eth:LAN'],
  ['mon', 'Blackmagic', 'SmartView HD', 'sdi3g', 'sdi3g:Loop'],
  ['mon', 'Sony', 'PVM-X2400', 'sdi12g*4,hdmi', 'sdi12g*2:Loop'],
  ['mon', 'Atomos', 'Shinobi SDI', 'sdi3g,hdmi', 'sdi3g:Loop'],
  ['mon', 'Lilliput', 'Q17 (12G)', 'sdi12g,hdmi', 'sdi12g:Loop'],
  // --- Мультивьюеры
  ['mv', 'Blackmagic', 'MultiView 16', 'sdi6g*16', 'sdi6g*2,hdmi'],
  ['mv', 'Blackmagic', 'MultiView 4 HD', 'sdi3g*4', 'sdi3g:Out,hdmi'],
  ['mv', 'Decimator', 'DMON-QUAD', 'sdi3g*4', 'sdi3g*2,hdmi'],
  ['mv', 'Generic', 'HDMI мультивьюер 4x1', 'hdmi*4', 'hdmi'],
  // --- LED
  ['led', 'Novastar', 'MCTRL4K', 'hdmi:HDMI 2.0,dp:DP 1.2,dvi', 'eth*16:Port,fiber*2:OPT,hdmi:Loop'],
  ['led', 'Novastar', 'MCTRL660 Pro', 'hdmi,dvi,sdi3g', 'eth*6:Port,fiber*2:OPT'],
  ['led', 'Novastar', 'MCTRL R5', 'hdmi,dp,sdi12g', 'eth*8:Port,fiber*2:OPT'],
  ['led', 'Novastar', 'VX600', 'hdmi*2,dvi,sdi3g', 'eth*6:Port,hdmi:Monitor'],
  ['led', 'Novastar', 'CVT10 (оптика↔медь)', 'fiber*2:OPT', 'eth*10:Port'],
  ['led', 'Novastar', 'MX40 Pro', 'hdmi*2:HDMI 2.0,dp:DP 1.2,sdi12g:12G-SDI,ref:Genlock', 'eth*20:Port,fiber*4:10G OPT,sdi12g:SDI Loop,eth:LAN'],
  ['led', 'Novastar', 'H5 (типовая конф.)', 'hdmi*4:HDMI 2.0,dvi*4,sdi3g*2', 'eth*16:Port,hdmi*2:Monitor,eth:LAN'],
  ['led', 'Novastar', 'VX400', 'hdmi,dvi,sdi3g', 'eth*4:Port,hdmi:Monitor,usb:USB'],
  ['led', 'Novastar', 'VX16s', 'hdmi*2:HDMI 1.3,hdmi:HDMI 2.0,dp,dvi*2,sdi3g', 'eth*16:Port,fiber*2:OPT,hdmi:Monitor,eth:LAN'],
  ['led', 'Novastar', 'TB60 (медиаплеер)', 'hdmi,usb', 'eth*2:Port,eth:LAN'],
  ['led', 'Generic', 'LED-экран (вход по оптике)', 'fiber*2:OPT', ''],
  ['led', 'Generic', 'Резервный канал экрана (Backup)', 'eth*4:Backup In', ''],
  ['led', 'Brompton', 'Tessera SX40', 'hdmi:HDMI 2.0,sdi12g*2,ref', 'sfp*4:10G Trunk,eth:LAN'],
  ['led', 'Brompton', 'Tessera XD 10G', 'sfp:10G Trunk', 'eth*10:Port,sfp:Loop'],
  ['led', 'Brompton', 'Tessera S8', 'hdmi,dvi,sdi3g', 'eth*8:Port'],
  ['led', 'Colorlight', 'X16', 'hdmi*2,dvi*2,sdi3g', 'eth*16:Port'],
  ['led', 'Colorlight', 'Z6 Pro', 'hdmi:HDMI 2.0,dp,sdi12g', 'eth*24:Port,fiber*4:OPT'],
  ['led', 'Generic', 'LED-экран (кабинеты)', 'eth*4:Data In', ''],
  ['led', 'Generic', 'Сигнальная лампа / таймер', 'gpio', ''],
  // --- Запись
  ['rec', 'Blackmagic', 'HyperDeck Studio 4K Pro', 'sdi12g,hdmi,ref,aud*2:XLR', 'sdi12g*2,hdmi,eth:LAN'],
  ['rec', 'Blackmagic', 'HyperDeck Studio HD Plus', 'sdi3g,hdmi', 'sdi3g,hdmi,eth:LAN'],
  ['rec', 'Blackmagic', 'HyperDeck Extreme 8K HDR', 'sdi12g*4,hdmi,ref', 'sdi12g*4,hdmi,eth:LAN'],
  ['rec', 'AJA', 'Ki Pro Ultra 12G', 'sdi12g*4,hdmi,ref', 'sdi12g*4,hdmi,eth:LAN'],
  ['rec', 'Atomos', 'Ninja V', 'hdmi', 'hdmi'],
  ['rec', 'Atomos', 'Shogun 7', 'sdi12g,hdmi', 'sdi12g,hdmi'],
  ['rec', 'Atomos', 'Ninja Ultra', 'hdmi', 'hdmi'],
  ['rec', 'Generic', 'Повтор (replay) сервер', 'sdi3g*6,ref', 'sdi3g*2,eth:LAN'],
  // --- ПК / медиасерверы
  ['nb', 'Generic', 'Ноутбук', 'usb:USB', 'hdmi:HDMI,usb:USB-C,aud:Audio Out,eth:LAN'],
  ['nb', 'Generic', 'Ноутбук с презентацией', 'usb:Кликер', 'hdmi:HDMI (презентация),aud:Audio Out,eth:LAN'],
  ['nb', 'Generic', 'Ноутбук с Resolume', 'usb:MIDI/контроллер,hdmi:Capture', 'hdmi:HDMI Out,dp:USB-C/DP Out,aud:Audio Out,eth:LAN (NDI/Art-Net)'],
  ['nb', 'Generic', 'Ноутбук с Event Master Toolset', '', 'eth:LAN → E2/Ex,hdmi:HDMI (монитор)'],
  ['nb', 'Generic', 'Ноутбук с NovaLCT / VPlat', '', 'usb:USB → контроллер,eth:LAN,hdmi:HDMI'],
  ['nb', 'Generic', 'Ноутбук с vMix / OBS', 'usb*2:Capture,eth:NDI', 'hdmi:HDMI Out,aud:Audio Out'],
  ['pc', 'Generic', 'ПК (2×DP + HDMI)', '', 'dp*2,hdmi,eth:LAN'],
  ['pc', 'Generic', 'ПК + DeckLink 8K Pro', 'sdi12g*2,ref', 'sdi12g*2,dp,eth:LAN'],
  ['pc', 'Apple', 'Mac mini / MacBook', '', 'hdmi,usb*2:USB-C,eth:LAN'],
  ['pc', 'Resolume', 'Arena медиасервер (4 выхода)', 'sdi3g*2:Capture', 'dp*4,eth:LAN'],
  ['pc', 'disguise', 'vx 4+ (VFC 12G)', 'ref,sdi12g*2:Capture', 'sdi12g*4,eth*2:LAN'],
  ['pc', 'Generic', 'Графический сервер (CasparCG)', 'ref', 'sdi3g*4:Fill/Key,eth:LAN'],
  ['pc', 'Generic', 'Видеоплеер (Brightsign/медиаплеер)', 'eth:LAN', 'hdmi'],
  // --- Стриминг / NDI
  ['enc', 'Blackmagic', 'Web Presenter HD', 'sdi3g,aud*2:XLR', 'sdi3g:Loop,usb:Webcam,eth:LAN'],
  ['enc', 'Blackmagic', 'Streaming Encoder HD', 'hdmi', 'eth:LAN,usb'],
  ['enc', 'Magewell', 'Pro Convert SDI 4K Plus', 'sdi12g', 'eth:NDI'],
  ['enc', 'Magewell', 'Pro Convert HDMI 4K Plus', 'hdmi', 'eth:NDI'],
  ['enc', 'Magewell', 'Pro Convert NDI to HDMI', 'eth:NDI', 'hdmi'],
  ['enc', 'BirdDog', 'Flex 4K OUT', 'eth:NDI', 'hdmi,sdi12g'],
  ['enc', 'Teradek', 'Prism Flex', 'sdi12g,hdmi', 'eth:LAN,hdmi:Loop'],
  ['enc', 'Haivision', 'Makito X4 (SRT)', 'sdi3g*4', 'eth*2:LAN'],
  ['enc', 'Teradek', 'Bolt 6 TX (беспроводной)', 'sdi12g,hdmi', 'sdi12g:Loop'],
  ['enc', 'Teradek', 'Bolt 6 RX (беспроводной)', '', 'sdi12g*2,hdmi'],
  ['enc', 'Hollyland', 'Mars 4K TX', 'sdi3g,hdmi', 'sdi3g:Loop'],
  ['enc', 'Hollyland', 'Mars 4K RX', '', 'sdi3g,hdmi'],
  // --- Сеть
  ['net', 'Generic', 'Коммутатор 8×1G', 'eth*8:Port', ''],
  ['net', 'Generic', 'Коммутатор 24×1G + 4×SFP+', 'eth*24:Port,sfp*4:SFP+', ''],
  ['net', 'Generic', 'Коммутатор 48×1G PoE', 'eth*48:Port', ''],
  ['net', 'Generic', 'Коммутатор 2110 32×100G', 'sfp*32:QSFP', ''],
  ['net', 'Generic', 'Роутер / Wi-Fi', 'eth*4:LAN,eth:WAN', ''],
  // --- Синхронизация
  ['sync', 'Blackmagic', 'Mini Converter Sync Generator', '', 'ref*6'],
  ['sync', 'Tektronix', 'SPG8000A', 'ref:Ext Ref,eth:PTP', 'ref*6,tc*2:LTC,eth:LAN'],
  ['sync', 'Evertz', '5601MSC', 'ref,eth:PTP', 'ref*8,tc*2'],
  ['sync', 'Generic', 'Генератор таймкода', '', 'tc*4'],
  // --- Звук
  ['aud', 'Generic', 'Микшерный пульт (аналог)', 'aud*16:Mic/Line', 'aud*8:Out'],
  ['aud', 'Generic', 'Цифровой пульт (Dante)', 'aud*16:Mic,madi', 'aud*8:Out,aes*2,madi,eth*2:Dante'],
  ['aud', 'Behringer', 'X32', 'aud*32:Mic,aes:AES50 A,aes:AES50 B', 'aud*16:Out,aes:AES Out,usb'],
  ['aud', 'Generic', 'Радиомикрофон (приёмник)', '', 'aud'],
  ['aud', 'Generic', 'Колонки / мониторы', 'aud*2', ''],
  ['aud', 'Generic', 'Аудио эмбеддер SDI', 'sdi3g,aud*4', 'sdi3g'],
  ['aud', 'Generic', 'Аудио де-эмбеддер SDI', 'sdi3g', 'sdi3g:Loop,aud*4'],
  // --- Управление
  ['ctl', 'Blackmagic', 'ATEM 1 M/E Advanced Panel', 'eth:LAN', ''],
  ['ctl', 'Blackmagic', 'ATEM Camera Control Panel', 'eth:LAN', ''],
  ['ctl', 'Panasonic', 'AW-RP150 PTZ пульт', 'eth:LAN,ctrl', ''],
  ['ctl', 'Sony', 'RCP-3500', 'eth:LAN', ''],
  ['ctl', 'Generic', 'Tally-контроллер', 'gpio*8,eth:LAN', 'gpio*8'],
  ['ctl', 'Generic', 'Интерком базовая станция', 'aud*4:4W,eth:LAN', 'aud*4:4W'],
  ['ctl', 'Generic', 'Stream Deck', '', 'usb'],
  ['ctl', 'Barco', 'Event Master EC-200 (пульт)', 'eth:LAN,hdmi*2:Монитор', ''],
  ['ctl', 'Barco', 'Event Master EC-50 (пульт)', 'eth:LAN,hdmi:Монитор', ''],
  ['ctl', 'PixelHue', 'PixelFlow / пульт управления', 'eth:LAN', ''],
  ['ctl', 'Generic', 'Кликер для презентаций (приёмник)', '', 'usb'],
  ['ctl', 'Generic', 'Таймер сцены (Stage timer)', 'hdmi,eth:LAN', ''],
  // --- Прочее
  ['pp', 'Generic', 'Патч-панель BNC 24 (нормаль)', 'sdi12g*24:Rear', 'sdi12g*24:Front'],
  ['pp', 'Generic', 'Проходной разъём (стена/пол)', 'sdi12g,hdmi,eth', 'sdi12g,hdmi,eth'],
  ['pp', 'Generic', 'Кабельный барабан (SDI)', 'sdi12g', 'sdi12g'],
  ['pp', 'Generic', 'Блок (пустой)', 'hdmi', 'hdmi'],
];

function parsePorts(spec, dir) {
  const out = [];
  if (!spec) return out;
  const counters = {};
  spec.split(',').map(s => s.trim()).filter(Boolean).forEach(item => {
    let [tc, name] = item.split(':');
    let [t, cnt] = tc.split('*');
    let nm = name;
    if (name && name.includes('*')) { [nm, cnt] = name.split('*'); }
    cnt = parseInt(cnt || '1', 10);
    if (!T[t]) t = 'sdi3g';
    for (let i = 0; i < cnt; i++) {
      const ck = T[t].s; counters[ck] = (counters[ck] || 0) + 1;
      let label;
      if (nm) label = cnt > 1 ? `${nm} ${i + 1}` : nm;
      else label = `${T[t].s} ${dir === 'in' ? 'IN' : 'OUT'} ${counters[ck]}`;
      out.push({ name: label, type: t, dir });
    }
  });
  return out;
}

// eth/sfp всегда двунаправленные
function normPorts(arr) {
  return arr.map(p => (T[p.type] && T[p.type].fam === 'eth') ? { ...p, dir: 'io' } : p);
}

const BUILTIN_LIB = RAW.map((r, i) => ({
  id: 'b' + i,
  cat: r[0], maker: r[1], model: r[2],
  ports: normPorts([...parsePorts(r[3], 'in'), ...parsePorts(r[4], 'out')]),
}));
