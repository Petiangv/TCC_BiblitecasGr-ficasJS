let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 src/components
badd +0 src/components/FluidSimulation/D3JSSimulation.jsx
badd +0 src/components/FluidSimulation/P5JSSimulation.jsx
badd +0 src/components/FluidSimulation/PixiJSSimulation.jsx
badd +0 src/components/FluidSimulation/ThreeJSSimulation.jsx
badd +0 src/App.js
badd +0 src/components/BenchmarkControls.jsx
badd +0 src/components/PerformanceMetrics.jsx
badd +0 src/hooks/usePerformanceMetrics.js
badd +0 src/reportWebVitals.js
argglobal
%argdel
set stal=2
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabrewind
edit src/components/FluidSimulation/P5JSSimulation.jsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
argglobal
balt src/components/FluidSimulation/D3JSSimulation.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
argglobal
if bufexists(fnamemodify("D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/D3JSSimulation.jsx", ":p")) | buffer D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/D3JSSimulation.jsx | else | edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/D3JSSimulation.jsx | endif
if &buftype ==# 'terminal'
  silent file D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/D3JSSimulation.jsx
endif
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/P5JSSimulation.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
tabnext
edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/ThreeJSSimulation.jsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
argglobal
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/PixiJSSimulation.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
argglobal
if bufexists(fnamemodify("D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/PixiJSSimulation.jsx", ":p")) | buffer D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/PixiJSSimulation.jsx | else | edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/PixiJSSimulation.jsx | endif
if &buftype ==# 'terminal'
  silent file D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/PixiJSSimulation.jsx
endif
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/ThreeJSSimulation.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
tabnext
edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/App.js
argglobal
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/FluidSimulation/ThreeJSSimulation.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 37 - ((36 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 37
normal! 04|
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
tabnext
edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/PerformanceMetrics.jsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
argglobal
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/BenchmarkControls.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
argglobal
if bufexists(fnamemodify("D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/BenchmarkControls.jsx", ":p")) | buffer D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/BenchmarkControls.jsx | else | edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/BenchmarkControls.jsx | endif
if &buftype ==# 'terminal'
  silent file D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/BenchmarkControls.jsx
endif
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/components/PerformanceMetrics.jsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
tabnext
edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/reportWebVitals.js
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
argglobal
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/hooks/usePerformanceMetrics.js
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
argglobal
if bufexists(fnamemodify("D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/hooks/usePerformanceMetrics.js", ":p")) | buffer D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/hooks/usePerformanceMetrics.js | else | edit D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/hooks/usePerformanceMetrics.js | endif
if &buftype ==# 'terminal'
  silent file D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/hooks/usePerformanceMetrics.js
endif
balt D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul/src/reportWebVitals.js
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 23) / 47)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
lcd D:/Downloa/Engenharia\ de\ Software/MBA/TCC/Resultados\ Preliminares/TentativaBásica/Compling/deep_simul
wincmd w
exe 'vert 1resize ' . ((&columns * 105 + 105) / 211)
exe 'vert 2resize ' . ((&columns * 105 + 105) / 211)
tabnext 3
set stal=1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
