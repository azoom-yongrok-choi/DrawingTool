var le=Object.defineProperty;var ce=(o,e,c)=>e in o?le(o,e,{enumerable:!0,configurable:!0,writable:!0,value:c}):o[e]=c;var X=(o,e,c)=>ce(o,typeof e!="symbol"?e+"":e,c);import{v as re,x as U,o as b,c as R,F as Z,q as ee,p as ue,t as Y,y as j,z as K,a as m,n as te,d as ie,_ as oe,A as de,r as I,B as he,C as F,b as G,w as se,D as Q}from"./kzx58MlV.js";class ge{constructor(){X(this,"history",[]);X(this,"currentIndex",0);this.history.push([])}get canUndo(){return this.currentIndex>0}get canRedo(){return this.currentIndex<this.history.length-1}push(e){if(this.currentIndex>=0&&JSON.stringify(this.history[this.currentIndex])===JSON.stringify(e))return;const c=e.map(d=>d.type==="line"?{...d,points:[...d.points]}:{...d});this.history=this.history.slice(0,this.currentIndex+1),this.history.push(c),this.currentIndex++}undo(){return this.canUndo?(this.currentIndex--,this.history[this.currentIndex].map(e=>e.type==="line"?{...e,points:[...e.points]}:{...e})):[]}redo(){return this.canRedo?(this.currentIndex++,this.history[this.currentIndex].map(e=>e.type==="line"?{...e,points:[...e.points]}:{...e})):this.history[this.currentIndex]||[]}clear(){this.history=[[]],this.currentIndex=0}getCurrentState(){var e;return((e=this.history[this.currentIndex])==null?void 0:e.map(c=>c.type==="line"?{...c,points:[...c.points]}:{...c}))||[]}}const ve=()=>new ge,pe=(o,e,c)=>{const[d,f]=o,[p,u]=e,[a,t]=c,r=Math.abs((t-u)*d-(a-p)*f+a*u-t*p),k=Math.sqrt(Math.pow(t-u,2)+Math.pow(a-p,2));return r/k},ne=(o,e)=>{if(o.length<4)return o;let c=0,d=0;const f=[o[0],o[1]],p=[o[o.length-2],o[o.length-1]];for(let u=2;u<o.length-2;u+=2){const a=pe([o[u],o[u+1]],f,p);a>c&&(c=a,d=u)}if(c>e){const u=ne(o.slice(0,d+2),e),a=ne(o.slice(d,o.length),e);return u.slice(0,-2).concat(a)}return[...f,...p]},ae=(o,e=1)=>ne(o,e),fe=async(o,e,c=30,d="#0000FF")=>{const f=o.toDataURL(),p=new Image;p.src=f,await new Promise(v=>{p.onload=v});const u=document.createElement("canvas");u.width=o.width(),u.height=o.height();const a=u.getContext("2d");if(!a)return null;a.drawImage(p,0,0);const t=a.getImageData(0,0,u.width,u.height),r=t.data,k=t.width,x=t.height,_=Math.round(e.x),D=Math.round(e.y);if(_<0||_>=k||D<0||D>=x)return null;const C=new Set,P=[[_,D]],T=(D*k+_)*4,J=r[T],$=r[T+1],z=r[T+2],O=r[T+3],q=parseInt(d.slice(1,3),16),H=parseInt(d.slice(3,5),16),W=parseInt(d.slice(5,7),16),E=(v,y,s,n)=>{const i=Math.abs(v-J),h=Math.abs(y-$),g=Math.abs(s-z),w=Math.abs(n-O),l=c/100*255;return i<=l&&h<=l&&g<=l&&w<=l},S=document.createElement("canvas");S.width=k,S.height=x;const B=S.getContext("2d");if(!B)return null;B.clearRect(0,0,k,x);const V=B.createImageData(k,x),M=V.data;for(;P.length>0;){const[v,y]=P.pop(),s=`${v},${y}`;if(C.has(s))continue;C.add(s);const n=(y*k+v)*4;if(E(r[n],r[n+1],r[n+2],r[n+3])){M[n]=q,M[n+1]=H,M[n+2]=W,M[n+3]=128;const i=[[v+1,y],[v-1,y],[v,y+1],[v,y-1],[v+1,y+1],[v+1,y-1],[v-1,y+1],[v-1,y-1]];for(const[h,g]of i)h<0||h>=k||g<0||g>=x||C.has(`${h},${g}`)||P.push([h,g])}}B.putImageData(V,0,0);const L=new Image;return L.src=S.toDataURL(),await new Promise(v=>{L.onload=v}),L},me={class:"tools"},ye=["onClick"],we={key:0,class:"brush-size"},ke={class:"size-display"},xe={key:1,class:"tolerance-slider"},Ie={class:"tolerance-display"},be={class:"file-input"},_e=["disabled"],Ce=["disabled"],Re=re({__name:"DrawingTools",props:{tools:{type:Array,required:!0},selectedTool:{type:String,required:!0},strokeWidth:{type:Number,required:!0},strokeColor:{type:String,required:!0},colorTolerance:{type:Number,required:!0,default:30},canUndo:{type:Boolean,required:!0},canRedo:{type:Boolean,required:!0}},emits:["select-tool","update:stroke-width","update:stroke-color","update:color-tolerance","upload-image","undo","redo","clear"],setup(o,{emit:e}){const c=o,d=e,f=U({get:()=>c.strokeWidth,set:a=>d("update:stroke-width",a)}),p=U({get:()=>c.strokeColor,set:a=>d("update:stroke-color",a)}),u=U({get:()=>c.colorTolerance,set:a=>d("update:color-tolerance",a)});return(a,t)=>(b(),R("div",me,[(b(!0),R(Z,null,ee(o.tools,r=>(b(),R("button",{key:r.name,class:ue({active:o.selectedTool===r.name}),onClick:k=>a.$emit("select-tool",r.name)},Y(r.icon),11,ye))),128)),o.selectedTool==="brush"?(b(),R("div",we,[j(m("input",{type:"range","onUpdate:modelValue":t[0]||(t[0]=r=>f.value=r),min:"1",max:"50"},null,512),[[K,f.value,void 0,{number:!0}]]),m("span",ke,Y(f.value)+"px",1)])):te("",!0),o.selectedTool==="magicwand"?(b(),R("div",xe,[j(m("input",{type:"range","onUpdate:modelValue":t[1]||(t[1]=r=>u.value=r),min:"0",max:"100",step:"1"},null,512),[[K,u.value,void 0,{number:!0}]]),m("span",Ie,"허용치: "+Y(u.value)+"%",1)])):te("",!0),j(m("input",{type:"color","onUpdate:modelValue":t[2]||(t[2]=r=>p.value=r)},null,512),[[K,p.value]]),m("label",be,[t[7]||(t[7]=ie(" 🖼️ ")),m("input",{type:"file",accept:"image/*",onChange:t[3]||(t[3]=r=>a.$emit("upload-image",r)),style:{display:"none"}},null,32)]),m("button",{onClick:t[4]||(t[4]=r=>a.$emit("undo")),disabled:!o.canUndo},"↩️",8,_e),m("button",{onClick:t[5]||(t[5]=r=>a.$emit("redo")),disabled:!o.canRedo},"↪️",8,Ce),m("button",{onClick:t[6]||(t[6]=r=>a.$emit("clear"))},"🗑️")]))}}),De=oe(Re,[["__scopeId","data-v-879bd885"]]),Me={class:"drawing-board"},Ue=3,Te=re({__name:"DrawingBoard",setup(o){const e=de({width:800,height:600}),c=[{name:"brush",icon:"🖌️"},{name:"eraser",icon:"⌫"},{name:"magicwand",icon:"✨"}],d=I("brush"),f=I("#000000"),p=I(5),u=I(30),a=I(!1),t=I([]),r=I(null),k=I(null),x=I(null),_=ve(),D=I({canUndo:!1,canRedo:!1}),C=()=>{D.value={canUndo:_.canUndo,canRedo:_.canRedo}},P=U(()=>D.value.canUndo),T=U(()=>D.value.canRedo),J=(s,n)=>Math.sqrt(Math.pow(n.x-s.x,2)+Math.pow(n.y-s.y,2)),$=I(null),z=I({image:null,width:0,height:0,x:0,y:0}),O=s=>{if(a.value){a.value=!1,x.value=null;const n=t.value[t.value.length-1];if((n==null?void 0:n.type)==="line"&&n.points.length>4){const i=ae(n.points);t.value=[...t.value.slice(0,-1),{...n,points:i}]}q()}d.value=s},q=()=>{_.push([...t.value]),C()},H=async s=>{a.value=!0;const n=s.target.getStage(),i=n.getPointerPosition();if(d.value==="magicwand"){const g=await fe(n,i,u.value,f.value);g&&(t.value=[...t.value,{id:Date.now(),type:"magicwand",image:g,color:f.value}],q()),a.value=!1;return}x.value=i;const h={id:Date.now(),points:[i.x,i.y],color:d.value==="eraser"?"#ffffff":f.value,width:d.value==="eraser"?20:p.value,type:"line"};t.value=[...t.value,h]},W=s=>{if(!a.value)return;const i=s.target.getStage().getPointerPosition();if(x.value&&J(x.value,i)<Ue)return;const h=t.value[t.value.length-1];if(h.type!=="line")return;const g=[...h.points,i.x,i.y];t.value=[...t.value.slice(0,-1),{...h,points:g}],x.value=i},E=()=>{if(!a.value)return;a.value=!1,x.value=null;const s=t.value[t.value.length-1];if((s==null?void 0:s.type)==="line"&&s.points.length>4){const n=ae(s.points);t.value=[...t.value.slice(0,-1),{...s,points:n}]}q()},S=()=>{const s=_.undo();t.value=[...s],C()},B=()=>{const s=_.redo();t.value=[...s],C()},V=()=>{t.value=[],_.clear(),C()},M=s=>{const n=e.width,i=e.height,h=s.width/s.height,g=n/i;let w=0,l=0,N=0,A=0;h>g?(w=n,l=n/h,A=(i-l)/2):(l=i,w=i*h,N=(n-w)/2),z.value={image:s,width:w,height:l,x:N,y:A}},L=async s=>{var g;const n=s.target;if(!((g=n.files)!=null&&g.length))return;const i=n.files[0],h=new FileReader;h.onload=async w=>{var N;const l=new Image;l.src=(N=w.target)==null?void 0:N.result,await new Promise(A=>{l.onload=()=>{$.value=l,M(l),A(!0)}})},h.readAsDataURL(i)},v=U(()=>t.value.filter(s=>s.type==="magicwand")),y=U(()=>t.value.filter(s=>s.type==="line"));return he(()=>{C();const s=()=>{var w;if(!((w=r.value)!=null&&w.$el))return;const n=r.value.$el.closest(".drawing-container");if(!n)return;const i=document.querySelector(".tools"),h=i?i.getBoundingClientRect().height:0,g=n.getBoundingClientRect();e.width=g.width,e.height=g.height-h-20,$.value&&M($.value)};return s(),window.addEventListener("resize",s),()=>{window.removeEventListener("resize",s)}}),(s,n)=>{const i=F("v-image"),h=F("v-line"),g=F("v-layer"),w=F("v-stage");return b(),R("div",Me,[G(De,{tools:c,"selected-tool":d.value,"stroke-width":p.value,"stroke-color":f.value,"color-tolerance":u.value,"can-undo":P.value,"can-redo":T.value,onSelectTool:O,"onUpdate:strokeWidth":n[0]||(n[0]=l=>p.value=l),"onUpdate:strokeColor":n[1]||(n[1]=l=>f.value=l),"onUpdate:colorTolerance":n[2]||(n[2]=l=>u.value=l),onUploadImage:L,onUndo:S,onRedo:B,onClear:V},null,8,["selected-tool","stroke-width","stroke-color","color-tolerance","can-undo","can-redo"]),G(w,{ref_key:"stageRef",ref:r,config:e,onMousedown:H,onMousemove:W,onMouseup:E,onTouchstart:H,onTouchmove:W,onTouchend:E},{default:se(()=>[G(g,{ref_key:"layerRef",ref:k},{default:se(()=>[$.value?(b(),Q(i,{key:0,config:z.value},null,8,["config"])):te("",!0),(b(!0),R(Z,null,ee(v.value,l=>(b(),Q(i,{key:l.id,config:{image:l.image,x:0,y:0,width:e.width,height:e.height,opacity:.7}},null,8,["config"]))),128)),(b(!0),R(Z,null,ee(y.value,l=>(b(),Q(h,{key:l.id,config:{points:l.points,stroke:l.color,strokeWidth:l.width,tension:.5,lineCap:"round",lineJoin:"round",opacity:.5}},null,8,["config"]))),128))]),_:1},512)]),_:1},8,["config"])])}}}),$e=oe(Te,[["__scopeId","data-v-46d2126b"]]),Se={},Be={class:"drawing-page"},Pe={class:"drawing-container"};function qe(o,e){const c=$e;return b(),R("div",Be,[e[0]||(e[0]=m("h1",null,[m("span",{class:"star left"},"🌟"),ie(" 귀여운 그림판 "),m("span",{class:"star right"},"🌟")],-1)),m("div",Pe,[G(c)]),e[1]||(e[1]=m("div",{class:"kawaii-footer"}," ₍ᐢ. ̫ .ᐢ₎ ",-1))])}const ze=oe(Se,[["render",qe],["__scopeId","data-v-6762f374"]]);export{ze as default};
