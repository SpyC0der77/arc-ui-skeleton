import {record} from './studio.mjs';
import {fileURLToPath} from 'node:url';
const tour={async tour(f){
  const p=f.page,button=name=>p.getByRole('button',{name,exact:true});
  f.mark('Sidebar and command menu');await f.move(150,220,1);await f.click(button('Open address bar'));await f.camera(720,420,1.35);await f.type(p.getByRole('combobox',{name:'Search or enter URL'}),'Home');await f.click(p.getByRole('option').filter({hasText:'Home'}));await f.camera();
  f.mark('Downloads rail');await f.click(button('Downloads'));await f.camera(250,450,1.25);await f.move(35,230,1);await f.beat(.6);await f.camera();await f.click(button('Close downloads'));
  f.mark('Collapsed sidebar and hover peek');await f.click(button('Close sidebar'));await f.move(800,350,1);await f.move(3,350,1.2);await f.beat(.6);await f.camera(330,450,1.25);await f.move(190,218,.8);await f.beat(.5);await f.move(850,450,1.1);await f.camera();
  await f.assert(()=>p.locator('body').innerText().then(t=>t.includes('Arc Browser UI Skeleton')||t.includes('Search or enter URL')),'Arc interface remains rendered after sidebar interactions');
 }}.tour;
await record({name:"arc-ui-skeleton",url:"https://arc-ui-skeleton.vercel.app",tour,output:fileURLToPath(new URL('../images/',import.meta.url))});
