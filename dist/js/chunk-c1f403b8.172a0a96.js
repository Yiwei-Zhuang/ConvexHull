(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c1f403b8"],{"2f38":function(t,e,n){},"408a":function(t,e,n){var a=n("e330");t.exports=a(1..valueOf)},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,n){var a=n("e330"),r=n("1d80"),i=n("577e"),s=n("5899"),o=a("".replace),l="["+s+"]",c=RegExp("^"+l+l+"*"),u=RegExp(l+l+"*$"),h=function(t){return function(e){var n=i(r(e));return 1&t&&(n=o(n,c,"")),2&t&&(n=o(n,u,"")),n}};t.exports={start:h(1),end:h(2),trim:h(3)}},7156:function(t,e,n){var a=n("1626"),r=n("861d"),i=n("d2bb");t.exports=function(t,e,n){var s,o;return i&&a(s=e.constructor)&&s!==n&&r(o=s.prototype)&&o!==n.prototype&&i(t,o),t}},"717a":function(t,e,n){"use strict";n("a9e3"),n("ac1f"),n("fb6a"),n("4e82");var a=n("26a8"),r=n("4b7c"),i=1,s=1,o=2,l=3,c=4,u=0,h=1;function p(t,e){var n=e+1;return n===t.length&&(n=0),n}function f(t,e){var n=e-1;return-1===n&&(n=t.length-1),n}function d(t){for(var e=-1,n=-1,a=0;a<t.length;a++)t[a].x>e&&(e=t[a].x,n=a);return n}function g(t){for(var e=Number.MAX_VALUE,n=Number.MAX_VALUE,a=0;a<t.length;a++)t[a].x<e&&(e=t[a].x,n=a);return n}function v(t,e,n){var x=t[g(t)].x,m=t[d(t)].x,b=e[g(e)].x,y=e[d(e)].x;if(t.length<6)t=r["a"].exec(t),n.push({type:o,points:t.slice(),part:u,xMin:x,xMax:y,message:"Use any way you like to find the convex hull for this small point set."});else{var k=Math.floor(t.length/2),w=t.slice(0,k),P=t.slice(k,t.length);n.push({type:s,left:w.slice(),right:P.slice(),mid:t[k],xMin:x,xMax:m,message:"Divide current sub-point set into left part and right part."}),t=v(w,P,n)}if(e.length<6)e=r["a"].exec(e),n.push({type:o,points:e.slice(),part:h,xMin:x,xMax:y,message:"Use any way you like to find the convex hull for this small point set."});else{var L=Math.floor(e.length/2),C=e.slice(0,L),M=e.slice(L,e.length);n.push({type:s,left:C.slice(),right:M.slice(),mid:e[L],xMin:b,xMax:y,message:"Divide current sub-point set into left part and right part."}),e=v(C,M,n)}var _=d(t),I=g(e);n.push({type:l,left:t.slice(),right:e.slice(),xMin:x,xMax:y,message:"Left and right parts' convex hull has been constructed."});var A=_,N=I;while(1===i){var S=p(t,A);while(a["a"].orient(e[N],t[A],t[S])>0)A=S,S=p(t,A);var T=f(e,N);while(a["a"].orient(e[T],e[N],t[A])>0)N=T,T=f(e,N);if(a["a"].orient(e[N],t[A],t[S])<0)break}var O=_,H=I;while(1===i){var E=p(e,H);while(a["a"].orient(t[O],e[H],e[E])>0)H=E,E=p(e,H);var R=f(t,O);while(a["a"].orient(t[R],t[O],e[H])>0)O=R,R=f(t,O);if(a["a"].orient(t[O],e[H],e[E])<0)break}for(var G=[],W=[],j=!1,D=!1,V=A;V<t.length;V++)if(G.push(t[V]),V===O){j=!0;break}if(!j)for(var $=0;$<=O;$++)G.push(t[$]);for(var F=H;F<e.length;F++)if(W.push(e[F]),F===N){D=!0;break}if(!D)for(var U=0;U<=N;U++)W.push(e[U]);return G.push.apply(G,W),n[n.length-1].whole=G.slice(),n.push({type:c,points:G,xMin:x,xMax:y,message:"Connect tangent lines in linear time."}),G}e["a"]={exec:function(t){if(t.length<4)return t;t.sort((function(t,e){var n=t.x,a=e.x;return n===a&&(e.x+=1e-5),n<a?-1:n>a?1:void 0}));var e=Math.floor(t.length/2),n=t.slice(0,e),a=t.slice(e,t.length),r=[{type:s,left:n.slice(),right:a.slice(),mid:t[e],xMin:t[0].x,xMax:t[t.length-1].x,message:"Divide current sub-point set into left part and right part."}],i=v(n,a,r);return{result:i,process:r}}}},a9e3:function(t,e,n){"use strict";var a=n("83ab"),r=n("da84"),i=n("e330"),s=n("94ca"),o=n("6eeb"),l=n("1a2d"),c=n("7156"),u=n("3a9b"),h=n("d9b5"),p=n("c04e"),f=n("d039"),d=n("241c").f,g=n("06cf").f,v=n("9bf2").f,x=n("408a"),m=n("58a8").trim,b="Number",y=r[b],k=y.prototype,w=r.TypeError,P=i("".slice),L=i("".charCodeAt),C=function(t){var e=p(t,"number");return"bigint"==typeof e?e:M(e)},M=function(t){var e,n,a,r,i,s,o,l,c=p(t,"number");if(h(c))throw w("Cannot convert a Symbol value to a number");if("string"==typeof c&&c.length>2)if(c=m(c),e=L(c,0),43===e||45===e){if(n=L(c,2),88===n||120===n)return NaN}else if(48===e){switch(L(c,1)){case 66:case 98:a=2,r=49;break;case 79:case 111:a=8,r=55;break;default:return+c}for(i=P(c,2),s=i.length,o=0;o<s;o++)if(l=L(i,o),l<48||l>r)return NaN;return parseInt(i,a)}return+c};if(s(b,!y(" 0o1")||!y("0b1")||y("+0x1"))){for(var _,I=function(t){var e=arguments.length<1?0:y(C(t)),n=this;return u(k,n)&&f((function(){x(n)}))?c(Object(e),n,I):e},A=a?d(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","),N=0;A.length>N;N++)l(y,_=A[N])&&!l(I,_)&&v(I,_,g(y,_));I.prototype=k,k.constructor=I,o(r,b,I)}},d8b6:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Nav",{ref:"nav"}),n("h1",{staticClass:"subtitle"},[t._v(t._s(t.msg))]),n("div",{staticClass:"tile is-ancestor"},[n("div",{staticClass:"tile is-parent is-8"},[n("div",{staticClass:"tile is-child box"},[n("GiftWrappingCanvas",{ref:"c",attrs:{canvasId:"canvas-one"},on:{message:t.getMessage,lock:function(e){t.lock=!0},unlock:function(e){t.lock=!1}}})],1)]),n("div",{staticClass:"tile is-vertical is-parent"},[n("div",{staticClass:"tile is-child box",staticStyle:{"min-height":"500px",height:"500px"}},[n("div",{staticStyle:{"margin-top":"150px"}},t._l(t.text,(function(e){return n("div",{key:e.message},[e.highLight?n("div",[n("div",{staticClass:"block has-background-primary has-text-white"},[t._v(" "+t._s(e.msg)+" ")])]):n("div",[n("div",{staticClass:"block mb-3"},[t._v(" "+t._s(e.msg)+" ")])])])})),0)]),n("div",{staticClass:"tile is-child"},[n("button",{staticClass:"button",attrs:{disabled:t.lock},on:{click:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])||"button"in e&&0!==e.button?null:t.reset.apply(null,arguments)}}},[n("strong",[t._v(" Reset ")])]),n("button",{staticClass:"button",attrs:{disabled:t.lock},on:{click:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])||"button"in e&&0!==e.button?null:t.last.apply(null,arguments)}}},[n("strong",[t._v(" Last ")])]),n("button",{staticClass:"button",attrs:{disabled:t.lock},on:{click:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])||"button"in e&&0!==e.button?null:t.next.apply(null,arguments)}}},[n("strong",[t._v(" Next ")])])])])]),t.preface?n("div",[n("div",{staticClass:"modal is-active"},[n("div",{staticClass:"modal-background"}),n("div",{staticClass:"modal-card",staticStyle:{"max-width":"500px"}},[n("header",{staticClass:"modal-card-head"},[n("p",{staticClass:"modal-card-title"},[t._v("Explanation")]),n("button",{staticClass:"delete",attrs:{"aria-label":"close"},on:{click:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])||"button"in e&&0!==e.button?null:t.closePreface.apply(null,arguments)}}})]),t._m(0)])])]):t._e()],1)},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"modal-card-body"},[n("p",{staticClass:"content"},[t._v('Remember in first section, we observe some points will definitely be on the convex hull such as left,right,top,bottom-most points. In second section. We observe that rotating "tangent lines" may be helpful for us to find convex hull. Gift-Wrapping is the very algorithm use this basic idea which can build a convex hull in '),n("strong",[t._v("O(n^2)")]),t._v(". This algorithm starts from the bottom point and draws a horizontal line which could not go through the convex hull of the point set. Rotate the line CCW and stop when it meets with another point. Repeat this process till we go back the bottom point.")])])}],i=n("1da1"),s=(n("96cf"),n("216c")),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("canvas",{ref:"cs",staticClass:"canvas-style",attrs:{id:t.canvasId}})])},l=[],c=n("3835"),u=(n("4fad"),n("ac1f"),n("fb6a"),n("d3b7"),n("2222")),h=n.n(u),p=n("717a"),f=n("26a8"),d="#ee9a33",g={name:"GiftWrappingCanvas",props:["canvasId"],data:function(){return{path:null,scope:null,tool:null,GLOBAL_CANVAS_WIDTH:800,GLOBAL_CANVAS_HEIGHT:600,points:[],pointPathMap:{},sortedPoints:[],addPoints:!0,convexHullList:[],convexHullPath:null,displayPath:null,displayPointList:[],states:[],step:-1,rotateTangentLine:null}},created:function(){},mounted:function(){this.scope=new h.a.PaperScope,this.scope.setup(this.canvasId),this.tool=this.createTool(this.scope),this.displayPath=new h.a.Path({strokeColor:"#000000"}),this.init()},methods:{createTool:function(t){return t.activate(),new h.a.Tool},drawPoint:function(t,e,n){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"#000000";t.activate();var r=new h.a.Path.Circle(new h.a.Point(e.x,e.y),n);return r.fillColor=a,r},pointNum:function(){return this.points.length},getPointPath:function(t){return this.pointPathMap[t.x+","+t.y]},p2c:function(t){return new h.a.Point(t.x,Math.floor(this.GLOBAL_CANVAS_HEIGHT-t.y))},sendMessage:function(t){this.$emit("message",t)},reset:function(){for(var t=0,e=Object.entries(this.pointPathMap);t<e.length;t++){var n=Object(c["a"])(e[t],2),a=n[1];a.removeSegments()}this.pointPathMap={},this.points=[],this.sortedPoints=[],this.addPoints=!0,this.convexHullList=[],this.convexHullPath&&this.convexHullPath.removeSegments(),this.convexHullPath=null,this.resetDisplay(),this.states=[],this.step=-1},resetDisplay:function(){for(var t=0;t<this.points.length;t++)this.getPointPath(this.points[t]).fillColor="#000000";this.displayPath&&this.displayPath.removeSegments(),this.displayPath=new h.a.Path({strokeColor:"#000000"}),this.displayPointList=[],null!=this.leftPath&&(this.leftPath.removeSegments(),this.leftPath=null),null!=this.rightPath&&(this.rightPath.removeSegments(),this.rightPath=null),null!=this.searchAreaPath&&(this.searchAreaPath.removeSegments(),this.searchAreaPath=null),null!=this.rotateTangentLine&&(this.rotateTangentLine.removeSegments(),this.rotateTangentLine=null)},init:function(){var t=this;this.tool.onMouseDown=function(e){if(t.addPoints){if(t.pointNum()>200)return void t.sendMessage("Max point number has been set to 200.");var n=t.p2c(e.point);n.x=Math.floor(n.x),n.y=Math.floor(n.y);for(var a=0;a<t.points.length;a++)if(t.points[a].x===n.x||t.points[a].y===n.y)return;t.points.push({x:n.x,y:n.y}),t.pointPathMap[n.x+","+n.y]=t.drawPoint(t.scope,t.p2c({x:n.x,y:n.y}),10)}}},prepare:function(){if(this.addPoints=!1,this.convexHullList.length<3){var t=p["a"].exec(this.points);this.convexHullList=t.result}for(var e,n=1e8,a=0;a<this.convexHullList.length;a++)this.convexHullList[a].y<n&&(n=this.convexHullList[a].y,e=a);for(var r=0;r<e;r++)this.convexHullList.push(this.convexHullList[r]);this.convexHullList=this.convexHullList.slice(e),this.states=this.convexHullList,this.resetDisplay();var i=this.convexHullList[0];this.getPointPath(i).fillColor=d,this.sendMessage("The lowest point must be on convex hull.")},readState:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var n,a,r,i,s,o,l,c,u,p,g,v,x,m,b;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(t.resetDisplay(),t.sendMessage("Although it looks like we can easily get next point by rotating tangent line CCW till reaching another point, it actually needs O(n) to compare slopes for each point pair."),n=0;n<=t.step;n++)t.displayPath.add(t.p2c(t.states[n])),t.getPointPath(t.states[n]).fillColor=d;a=t.states[t.step],r=f["a"].getNextPoint(a,t.states),i=f["a"].getLastPoint(a,t.states),s=(i.y-a.y)/(i.x-a.x),o=(r.y-a.y)/(r.x-a.x),l=Math.floor(180*Math.atan(o)/Math.PI),0===t.step&&(s=0),c=a.y-s*a.x,u=0,p=c,g=t.GLOBAL_CANVAS_WIDTH,v=g*s+c,x=new h.a.Path({strokeColor:"#000000"}),x.add(t.p2c({x:u,y:p})),x.add(t.p2c({x:g,y:v})),t.rotateTangentLine=x,m=Math.floor(180*Math.atan(s)/Math.PI);case 20:if(l===m||l+180===m){e.next=37;break}return s=Math.tan(m*Math.PI/180),c=a.y-s*a.x,u=0,p=c,g=t.GLOBAL_CANVAS_WIDTH,v=g*s+c,t.rotateTangentLine.removeSegments(),b=new h.a.Path({strokeColor:"#000000"}),b.add(t.p2c({x:u,y:p})),b.add(t.p2c({x:g,y:v})),t.rotateTangentLine=b,e.next=34,new Promise((function(t){return setTimeout(t,20)}));case 34:m++,e.next=20;break;case 37:return t.rotateTangentLine.removeSegments(),t.displayPath.add(t.p2c(r)),t.getPointPath(r).fillColor=d,e.abrupt("return",t.step);case 41:case"end":return e.stop()}}),e)})))()},nextState:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!(t.step+1<t.states.length)){e.next=7;break}return t.step++,e.next=4,t.readState();case 4:return e.abrupt("return",e.sent);case 7:return e.abrupt("return",null);case 8:case"end":return e.stop()}}),e)})))()},lastState:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!(t.step-1>=0)){e.next=7;break}return t.step--,e.next=4,t.readState();case 4:return e.abrupt("return",e.sent);case 7:return e.abrupt("return",null);case 8:case"end":return e.stop()}}),e)})))()}}},v=g,x=(n("dcd6"),n("2877")),m=Object(x["a"])(v,o,l,!1,null,"d262230e",null),b=m.exports,y={components:{Nav:s["a"],GiftWrappingCanvas:b},name:"GiftWrapping",data:function(){return{msg:"Please add more than three points on our canvas first.",preface:!0,lock:!1,currentIndex:-1,clickAuto:!1,text:[{msg:"Find lowest point",highLight:!1},{msg:"Rotate last tangent line CCW",highLight:!1}]}},mounted:function(){},methods:{getMessage:function(t){this.msg=t},next:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.lock=!0,!(t.$refs.c.pointNum()<=3)){e.next=4;break}return t.lock=!1,e.abrupt("return",!1);case 4:if(-1!==t.currentIndex){e.next=10;break}for(t.currentIndex++,n=0;n<t.text.length;n++)t.text[n].highLight=n===t.currentIndex;t.$refs.c.prepare(),e.next=13;break;case 10:for(a=0;a<t.text.length;a++)t.text[a].highLight=1===a;return e.next=13,t.$refs.c.nextState();case 13:return t.lock=!1,e.abrupt("return",!0);case 15:case"end":return e.stop()}}),e)})))()},last:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.lock=!0,e.next=3,t.$refs.c.lastState();case 3:if(n=e.sent,null===n){e.next=8;break}t.currentIndex=1,e.next=11;break;case 8:return t.currentIndex=0,e.next=11,t.$refs.c.prepare();case 11:for(a=0;a<t.text.length;a++)t.text[a].highLight=a===t.currentIndex;t.lock=!1;case 13:case"end":return e.stop()}}),e)})))()},closePreface:function(){this.preface=!1},reset:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(t.currentIndex=-1,n=0;n<t.text.length;n++)t.text[n].highLight=!1;return t.msg="Please add more than three points on our canvas first.",e.next=5,t.$refs.c.reset();case 5:t.lock=!1,t.clickAuto=!1;case 7:case"end":return e.stop()}}),e)})))()}}},k=y,w=Object(x["a"])(k,a,r,!1,null,"4a259f22",null);e["default"]=w.exports},dcd6:function(t,e,n){"use strict";n("2f38")}}]);
//# sourceMappingURL=chunk-c1f403b8.172a0a96.js.map