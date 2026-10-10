import {record} from './studio.mjs';
import {fileURLToPath} from 'node:url';
// Reveal the real hover preview before the first captured frame.
async function reveal(page){
 await page.mouse.move(3,180);await page.waitForTimeout(300);
 await page.mouse.move(100,180);await page.waitForTimeout(250);
}
async function prepare(page){
 await page.getByRole('button',{name:'Close sidebar',exact:true}).click();
 await reveal(page);
}
async function tour(f){
 const p=f.page,preview=p.getByRole('complementary',{name:'Sidebar preview',exact:true});
 const floatingButton=name=>preview.getByRole('button',{name,exact:true});
 const visiblePreview=()=>preview.getAttribute('aria-hidden').then(value=>value==='false');
 f.mark('Floating sidebar controls');
 await f.assert(visiblePreview,'The floating sidebar is open');
 await f.move(170,220,.8);await f.beat(.4);
 await f.click(floatingButton('Back'));await f.click(floatingButton('Forward'));
 f.mark('Address palette');
 await f.click(floatingButton('Open address bar'));
 await f.camera(512,350,1.35,.65);
 await f.type(p.getByRole('combobox',{name:'Search or enter URL'}),'Home');
 await p.keyboard.press('ArrowDown');await f.beat(.4);
 await p.keyboard.press('ArrowUp');await f.beat(.45);
 await p.keyboard.press('Escape');await p.waitForTimeout(350);
 // Cut back to the revealed panel without filming an empty-page transit.
 await reveal(p);await f.cutPointer(100,180);await f.assert(visiblePreview,'The floating sidebar is revealed after closing the palette');f.cutCamera(220,460,1.75);
 f.mark('Downloads popup in the floating sidebar');
 await f.hover(floatingButton('Downloads'),.9);
 const menu=p.getByRole('menu',{name:'Downloads',exact:true});
 await f.assert(()=>menu.isVisible(),'Downloads popup is visible');
 await f.hover(menu.getByRole('menuitem').filter({hasText:'sidebar-spec.pdf'}),.65);
 await f.hover(menu.getByRole('menuitem').filter({hasText:'boost-wallpaper.png'}),.65);
 await f.assert(visiblePreview,'The sidebar stays open while using its downloads popup');
 f.mark('Dock the floating sidebar');
 await f.move(110,300,.65);await f.camera(220,170,2.1,.8);
 await f.move(100,120,.6);await f.assert(visiblePreview,'The floating panel remains visible');
 await f.click(floatingButton('Close sidebar'));await f.beat(.5);
 await f.assert(()=>p.getByRole('complementary',{name:'Sidebar preview',exact:true}).count().then(n=>n===0),'The floating sidebar docks into the page');
}
await record({name:'arc-ui-skeleton',url:'https://arc-ui-skeleton.vercel.app',tour,prepare,
 initialCamera:{x:220,y:170,z:2.1},initialPointer:{x:100,y:180},outro:false,
 output:fileURLToPath(new URL('../images/',import.meta.url))});
