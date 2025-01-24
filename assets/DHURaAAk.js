var ie=Object.defineProperty;var ce=(o,e,u)=>e in o?ie(o,e,{enumerable:!0,configurable:!0,writable:!0,value:u}):o[e]=u;var Y=(o,e,u)=>ce(o,typeof e!="symbol"?e+"":e,u);import{v as re,x as ue,y as M,o as C,c as D,a as p,F as Z,q as ee,z as G,A as K,t as b,n as te,d as le,B as de,p as ge,_ as oe,C as he,r as _,D as ve,E as J,b as j,w as ae,G as Q}from"./_lTyPyUI.js";class pe{constructor(){Y(this,"history",[]);Y(this,"currentIndex",0);this.history.push([])}get canUndo(){return this.currentIndex>0}get canRedo(){return this.currentIndex<this.history.length-1}push(e){if(this.currentIndex>=0&&JSON.stringify(this.history[this.currentIndex])===JSON.stringify(e))return;const u=e.map(g=>g.type==="line"?{...g,points:[...g.points]}:{...g});this.history=this.history.slice(0,this.currentIndex+1),this.history.push(u),this.currentIndex++}undo(){return this.canUndo?(this.currentIndex--,this.history[this.currentIndex].map(e=>e.type==="line"?{...e,points:[...e.points]}:{...e})):[]}redo(){return this.canRedo?(this.currentIndex++,this.history[this.currentIndex].map(e=>e.type==="line"?{...e,points:[...e.points]}:{...e})):this.history[this.currentIndex]||[]}clear(){this.history=[[]],this.currentIndex=0}getCurrentState(){var e;return((e=this.history[this.currentIndex])==null?void 0:e.map(u=>u.type==="line"?{...u,points:[...u.points]}:{...u}))||[]}}const fe=()=>new pe,me=(o,e,u)=>{const[g,w]=o,[m,d]=e,[h,s]=u,t=Math.abs((s-d)*g-(h-m)*w+h*d-s*m),l=Math.sqrt(Math.pow(s-d,2)+Math.pow(h-m,2));return t/l},ne=(o,e)=>{if(o.length<4)return o;let u=0,g=0;const w=[o[0],o[1]],m=[o[o.length-2],o[o.length-1]];for(let d=2;d<o.length-2;d+=2){const h=me([o[d],o[d+1]],w,m);h>u&&(u=h,g=d)}if(u>e){const d=ne(o.slice(0,g+2),e),h=ne(o.slice(g,o.length),e);return d.slice(0,-2).concat(h)}return[...w,...m]},se=(o,e=1)=>ne(o,e),ye=async(o,e,u=30,g="#0000FF")=>{const w=o.toDataURL(),m=new Image;m.src=w,await new Promise(y=>{m.onload=y});const d=document.createElement("canvas");d.width=o.width(),d.height=o.height();const h=d.getContext("2d");if(!h)return null;h.drawImage(m,0,0);const s=h.getImageData(0,0,d.width,d.height),t=s.data,l=s.width,r=s.height,I=Math.round(e.x),x=Math.round(e.y);if(I<0||I>=l||x<0||x>=r)return null;const R=new Set,q=[[I,x]],T=(x*l+I)*4,O=t[T],S=t[T+1],H=t[T+2],X=t[T+3],L=parseInt(g.slice(1,3),16),E=parseInt(g.slice(3,5),16),V=parseInt(g.slice(5,7),16),W=(y,k,a,n)=>{const i=Math.abs(y-O),v=Math.abs(k-S),f=Math.abs(a-H),$=Math.abs(n-X),c=u/100*255;return i<=c&&v<=c&&f<=c&&$<=c},P=document.createElement("canvas");P.width=l,P.height=r;const B=P.getContext("2d");if(!B)return null;B.clearRect(0,0,l,r);const A=B.createImageData(l,r),U=A.data;for(;q.length>0;){const[y,k]=q.pop(),a=`${y},${k}`;if(R.has(a))continue;R.add(a);const n=(k*l+y)*4;if(W(t[n],t[n+1],t[n+2],t[n+3])){U[n]=L,U[n+1]=E,U[n+2]=V,U[n+3]=128;const i=[[y+1,k],[y-1,k],[y,k+1],[y,k-1],[y+1,k+1],[y+1,k-1],[y-1,k+1],[y-1,k-1]];for(const[v,f]of i)v<0||v>=l||f<0||f>=r||R.has(`${v},${f}`)||q.push([v,f])}}B.putImageData(A,0,0);const z=new Image;return z.src=P.toDataURL(),await new Promise(y=>{z.onload=y}),z},we={class:"tools"},be={class:"tool-group"},ke=["onClick"],$e={key:0,class:"brush-size"},Ie=["aria-label"],_e={class:"size-display"},Ce={key:1,class:"tolerance-slider"},Re=["aria-label"],De={class:"tolerance-display"},xe={class:"tool-group"},Me=["aria-label"],Ue={class:"file-input"},Te=["disabled","aria-label"],Se=["disabled","aria-label"],Pe=["aria-label"],Be={class:"language-selector"},qe=["aria-label"],Le={value:"ko"},ze={value:"en"},Ne={value:"ja"},He=re({__name:"DrawingTools",props:{tools:{type:Array,required:!0},selectedTool:{type:String,required:!0},strokeWidth:{type:Number,required:!0},strokeColor:{type:String,required:!0},colorTolerance:{type:Number,required:!0,default:30},canUndo:{type:Boolean,required:!0},canRedo:{type:Boolean,required:!0}},emits:["select-tool","update:stroke-width","update:stroke-color","update:color-tolerance","upload-image","undo","redo","clear"],setup(o,{emit:e}){const{locale:u}=ue(),g=M({get:()=>u.value,set:t=>u.value=t}),w=o,m=e,d=M({get:()=>w.strokeWidth,set:t=>m("update:stroke-width",t)}),h=M({get:()=>w.strokeColor,set:t=>m("update:stroke-color",t)}),s=M({get:()=>w.colorTolerance,set:t=>m("update:color-tolerance",t)});return(t,l)=>(C(),D("div",we,[p("div",be,[(C(!0),D(Z,null,ee(o.tools,r=>(C(),D("button",{key:r.name,class:ge({active:o.selectedTool===r.name}),onClick:I=>t.$emit("select-tool",r.name)},b(r.icon)+" "+b(t.$t(`tools.${r.name}`)),11,ke))),128))]),o.selectedTool==="brush"?(C(),D("div",$e,[G(p("input",{type:"range","onUpdate:modelValue":l[0]||(l[0]=r=>d.value=r),min:"1",max:"50","aria-label":t.$t("settings.brushSize")},null,8,Ie),[[K,d.value,void 0,{number:!0}]]),p("span",_e,b(d.value)+b(t.$t("settings.px")),1)])):te("",!0),o.selectedTool==="magicwand"?(C(),D("div",Ce,[G(p("input",{type:"range","onUpdate:modelValue":l[1]||(l[1]=r=>s.value=r),min:"0",max:"100",step:"1","aria-label":t.$t("settings.toleranceSlider")},null,8,Re),[[K,s.value,void 0,{number:!0}]]),p("span",De,b(t.$t("settings.tolerance"))+": "+b(s.value)+b(t.$t("settings.percent")),1)])):te("",!0),p("div",xe,[G(p("input",{type:"color","onUpdate:modelValue":l[2]||(l[2]=r=>h.value=r),"aria-label":t.$t("settings.colorPicker")},null,8,Me),[[K,h.value]]),p("label",Ue,[le(b(t.$t("tools.upload"))+" ",1),p("input",{type:"file",accept:"image/*",onChange:l[3]||(l[3]=r=>t.$emit("upload-image",r)),style:{display:"none"}},null,32)]),p("button",{onClick:l[4]||(l[4]=r=>t.$emit("undo")),disabled:!o.canUndo,"aria-label":t.$t("tools.undo")},b(t.$t("tools.undo")),9,Te),p("button",{onClick:l[5]||(l[5]=r=>t.$emit("redo")),disabled:!o.canRedo,"aria-label":t.$t("tools.redo")},b(t.$t("tools.redo")),9,Se),p("button",{onClick:l[6]||(l[6]=r=>t.$emit("clear")),"aria-label":t.$t("tools.clear")},b(t.$t("tools.clear")),9,Pe)]),p("div",Be,[G(p("select",{"onUpdate:modelValue":l[7]||(l[7]=r=>g.value=r),"aria-label":t.$t("settings.language")},[p("option",Le,b(t.$t("language.ko")),1),p("option",ze,b(t.$t("language.en")),1),p("option",Ne,b(t.$t("language.ja")),1)],8,qe),[[de,g.value]])])]))}}),Ee=oe(He,[["__scopeId","data-v-80a1993d"]]),Ve={class:"drawing-board"},We=3,Ae=re({__name:"DrawingBoard",setup(o){const e=he({width:800,height:600}),u=[{name:"brush",icon:"🖌️"},{name:"eraser",icon:"⌫"},{name:"magicwand",icon:"✨"}],g=_("brush"),w=_("#000000"),m=_(5),d=_(30),h=_(!1),s=_([]),t=_(null),l=_(null),r=_(null),I=fe(),x=_({canUndo:!1,canRedo:!1}),R=()=>{x.value={canUndo:I.canUndo,canRedo:I.canRedo}},q=M(()=>x.value.canUndo),T=M(()=>x.value.canRedo),O=(a,n)=>Math.sqrt(Math.pow(n.x-a.x,2)+Math.pow(n.y-a.y,2)),S=_(null),H=_({image:null,width:0,height:0,x:0,y:0}),X=a=>{if(h.value){h.value=!1,r.value=null;const n=s.value[s.value.length-1];if((n==null?void 0:n.type)==="line"&&n.points.length>4){const i=se(n.points);s.value=[...s.value.slice(0,-1),{...n,points:i}]}L()}g.value=a},L=()=>{I.push([...s.value]),R()},E=async a=>{h.value=!0;const n=a.target.getStage(),i=n.getPointerPosition();if(g.value==="magicwand"){const f=await ye(n,i,d.value,w.value);f&&(s.value=[...s.value,{id:Date.now(),type:"magicwand",image:f,color:w.value}],L()),h.value=!1;return}r.value=i;const v={id:Date.now(),points:[i.x,i.y],color:g.value==="eraser"?"#ffffff":w.value,width:g.value==="eraser"?20:m.value,type:"line"};s.value=[...s.value,v]},V=a=>{if(!h.value)return;const i=a.target.getStage().getPointerPosition();if(r.value&&O(r.value,i)<We)return;const v=s.value[s.value.length-1];if(v.type!=="line")return;const f=[...v.points,i.x,i.y];s.value=[...s.value.slice(0,-1),{...v,points:f}],r.value=i},W=()=>{if(!h.value)return;h.value=!1,r.value=null;const a=s.value[s.value.length-1];if((a==null?void 0:a.type)==="line"&&a.points.length>4){const n=se(a.points);s.value=[...s.value.slice(0,-1),{...a,points:n}]}L()},P=()=>{const a=I.undo();s.value=[...a],R()},B=()=>{const a=I.redo();s.value=[...a],R()},A=()=>{s.value=[],I.clear(),R()},U=a=>{const n=e.width,i=e.height,v=a.width/a.height,f=n/i;let $=0,c=0,N=0,F=0;v>f?($=n,c=n/v,F=(i-c)/2):(c=i,$=i*v,N=(n-$)/2),H.value={image:a,width:$,height:c,x:N,y:F}},z=async a=>{var f;const n=a.target;if(!((f=n.files)!=null&&f.length))return;const i=n.files[0],v=new FileReader;v.onload=async $=>{var N;const c=new Image;c.src=(N=$.target)==null?void 0:N.result,await new Promise(F=>{c.onload=()=>{S.value=c,U(c),F(!0)}})},v.readAsDataURL(i)},y=M(()=>s.value.filter(a=>a.type==="magicwand")),k=M(()=>s.value.filter(a=>a.type==="line"));return ve(()=>{R();const a=()=>{var $;if(!(($=t.value)!=null&&$.$el))return;const n=t.value.$el.closest(".drawing-container");if(!n)return;const i=document.querySelector(".tools"),v=i?i.getBoundingClientRect().height:0,f=n.getBoundingClientRect();e.width=f.width,e.height=f.height-v-20,S.value&&U(S.value)};return a(),window.addEventListener("resize",a),()=>{window.removeEventListener("resize",a)}}),(a,n)=>{const i=J("v-image"),v=J("v-line"),f=J("v-layer"),$=J("v-stage");return C(),D("div",Ve,[j(Ee,{tools:u,"selected-tool":g.value,"stroke-width":m.value,"stroke-color":w.value,"color-tolerance":d.value,"can-undo":q.value,"can-redo":T.value,onSelectTool:X,"onUpdate:strokeWidth":n[0]||(n[0]=c=>m.value=c),"onUpdate:strokeColor":n[1]||(n[1]=c=>w.value=c),"onUpdate:colorTolerance":n[2]||(n[2]=c=>d.value=c),onUploadImage:z,onUndo:P,onRedo:B,onClear:A},null,8,["selected-tool","stroke-width","stroke-color","color-tolerance","can-undo","can-redo"]),j($,{ref_key:"stageRef",ref:t,config:e,onMousedown:E,onMousemove:V,onMouseup:W,onTouchstart:E,onTouchmove:V,onTouchend:W},{default:ae(()=>[j(f,{ref_key:"layerRef",ref:l},{default:ae(()=>[S.value?(C(),Q(i,{key:0,config:H.value},null,8,["config"])):te("",!0),(C(!0),D(Z,null,ee(y.value,c=>(C(),Q(i,{key:c.id,config:{image:c.image,x:0,y:0,width:e.width,height:e.height,opacity:.7}},null,8,["config"]))),128)),(C(!0),D(Z,null,ee(k.value,c=>(C(),Q(v,{key:c.id,config:{points:c.points,stroke:c.color,strokeWidth:c.width,tension:.5,lineCap:"round",lineJoin:"round",opacity:.5}},null,8,["config"]))),128))]),_:1},512)]),_:1},8,["config"])])}}}),Fe=oe(Ae,[["__scopeId","data-v-46d2126b"]]),Ge={},Je={class:"drawing-page"},je={class:"drawing-container"};function Oe(o,e){const u=Fe;return C(),D("div",Je,[p("h1",null,[e[0]||(e[0]=p("span",{class:"star left"},"🌟",-1)),le(" "+b(o.$t("drawing.title"))+" ",1),e[1]||(e[1]=p("span",{class:"star right"},"🌟",-1))]),p("div",je,[j(u)]),e[2]||(e[2]=p("div",{class:"kawaii-footer"}," ₍ᐢ. ̫ .ᐢ₎ ",-1))])}const Ke=oe(Ge,[["render",Oe],["__scopeId","data-v-b58d478f"]]);export{Ke as default};
