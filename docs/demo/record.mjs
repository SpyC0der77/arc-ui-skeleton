import {record} from './studio.mjs';
import {fileURLToPath} from 'node:url';
async function tour(f){
 const p=f.page,preview=p.getByRole('complementary',{name:'Sidebar preview',exact:true});
 const floatingButton=name=>preview.getByRole('button',{name,exact:true});
 const visiblePreview=()=>preview.getAttribute('aria-hidden').then(value=>value==='false');
 f.mark('Docked sidebar and address palette');
 await f.assert(()=>preview.count().then(n=>n===0),'The sidebar starts docked');
 await f.click(p.getByRole('button',{name:'Open address bar',exact:true}));
 await f.camera(512,350,1.35,.65);
 await f.type(p.getByRole('combobox',{name:'Search or enter URL'}),'Home');
 await p.keyboard.press('ArrowDown');await f.beat(.4);
 await p.keyboard.press('ArrowUp');await f.beat(.45);
 await p.keyboard.press('Escape');await f.beat(.4);
 f.cutCamera(220,130,2.1);await f.cutPointer(100,180);
 f.mark('Undock and reveal the floating sidebar');
 // Slow the browser clock around the real layout transitions for a clear demo.
 f.rate=.35;
 await f.click(p.getByRole('button',{name:'Close sidebar',exact:true}));
 await f.move(3,180,.6);await f.move(100,180,.6);await f.beat(.5);
 f.rate=1;
 await f.assert(visiblePreview,'The undocked floating sidebar is visible');
 await f.camera(220,460,1.75,.8);
 f.mark('Downloads popup in the floating sidebar');
 await f.hover(floatingButton('Downloads'),.9);
 const menu=p.getByRole('menu',{name:'Downloads',exact:true});
 await f.assert(()=>menu.isVisible(),'Downloads popup is visible');
 await f.hover(menu.getByRole('menuitem').filter({hasText:'sidebar-spec.pdf'}),.65);
 await f.hover(menu.getByRole('menuitem').filter({hasText:'boost-wallpaper.png'}),.65);
 await f.assert(visiblePreview,'The sidebar stays open while using its downloads popup');
 f.mark('Dock the floating sidebar');
 await f.move(110,300,.65);await f.camera(220,130,2.1,.8);
 await f.move(100,120,.6);await f.assert(visiblePreview,'The floating panel remains visible');
 f.rate=.35;await f.click(floatingButton('Close sidebar'));await f.beat(.7);f.rate=1;
 await f.assert(async()=>await p.locator('[data-slot=sidebar]').getAttribute('data-state')==='expanded'&&await p.getByRole('complementary').count()===0,'The floating sidebar finishes docking into the page');
}
await record({name:'arc-ui-skeleton',url:'https://arc-ui-skeleton.vercel.app',tour,
 initialCamera:{x:220,y:130,z:2.1},initialPointer:{x:100,y:180},outro:false,
 output:fileURLToPath(new URL('../images/',import.meta.url))});
