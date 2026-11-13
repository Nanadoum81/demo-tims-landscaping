// Tim's Landscaping — hero slideshow, mobile nav, gallery lightbox, form demo handler.
(function(){
  "use strict";
  // Mobile nav
  var burger=document.querySelector(".burger"), mnav=document.querySelector(".mnav");
  if(burger&&mnav){burger.addEventListener("click",function(){
    var open=mnav.classList.toggle("open");
    burger.setAttribute("aria-expanded",open?"true":"false");
  });}
  // Hero slideshow: crossfade every 5s
  var slides=document.querySelectorAll(".hero-slides .slide"),
      dotsWrap=document.querySelector(".hero-dots"), dots=[], cur=0, timer=null;
  if(slides.length>1&&dotsWrap){
    slides.forEach(function(_,i){
      var b=document.createElement("button");
      b.type="button"; b.setAttribute("aria-label","Show photo "+(i+1));
      if(i===0)b.className="on";
      b.addEventListener("click",function(){go(i);restart();});
      dotsWrap.appendChild(b); dots.push(b);
    });
    function go(n){
      slides[cur].classList.remove("active"); dots[cur].classList.remove("on");
      cur=n; slides[cur].classList.add("active"); dots[cur].classList.add("on");
      // restart Ken Burns on the newly shown image
      var img=slides[cur].querySelector("img");
      if(img){img.style.animation="none"; void img.offsetWidth; img.style.animation="";}
    }
    function next(){go((cur+1)%slides.length);}
    function restart(){if(timer)clearInterval(timer); timer=setInterval(next,5000);}
    restart();
  }
  // Gallery lightbox
  var lb=document.querySelector(".lightbox"), lbImg=lb?lb.querySelector("img"):null;
  if(lb&&lbImg){
    document.querySelectorAll(".gal figure").forEach(function(f){
      f.addEventListener("click",function(){
        var img=f.querySelector("img"); if(!img)return;
        lbImg.src=img.currentSrc||img.src; lbImg.alt=img.alt;
        lb.classList.add("open");
      });
    });
    lb.addEventListener("click",function(){lb.classList.remove("open");lbImg.src="";});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")lb.classList.remove("open");});
  }
  // Estimate form: demo submit (live CRM wiring lands with the HighLevel build)
  document.querySelectorAll("form.estform").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var ok=f.querySelector(".formok");
      if(ok){ok.style.display="block"; ok.scrollIntoView({behavior:"smooth",block:"center"});}
    });
  });
})();

// Widget stacking (Emmanuel standard): tag both widgets so
// assets/site.css can lift it above the chat bubble. The HighLevel
// loader creates one <chat-widget> host per widget and assigns its
// widgetId as a JS property, not an attribute, and the two hosts are
// appended in a load-order race, so DOM order cannot identify the
// voice widget; its widgetId can.
(function(){
  "use strict";
  var VOICE_WIDGET_ID="6af6751390f7860d291fcf7d",CHAT_WIDGET_ID="6af6401a0fbf641fd173fe3a";
  function tagVoiceWidget(el){
    if(!el||(el.hasAttribute("data-voice-widget")&&el.hasAttribute("data-chat-widget")))return;
    var id=el.widgetId||el.getAttribute("widget-id")||el.getAttribute("data-widget-id");
    if(id===VOICE_WIDGET_ID)el.setAttribute("data-voice-widget","");else if(id===CHAT_WIDGET_ID)el.setAttribute("data-chat-widget","");
  }
  function scanWidgets(root){
    if(!root||!root.querySelectorAll)return;
    var list=root.querySelectorAll("chat-widget");
    for(var i=0;i<list.length;i++)tagVoiceWidget(list[i]);
  }
  scanWidgets(document);
  if(window.MutationObserver){
    var observer=new MutationObserver(function(mutations){
      for(var i=0;i<mutations.length;i++){
        var added=mutations[i].addedNodes;
        for(var j=0;j<added.length;j++){
          var n=added[j];
          if(n.nodeType!==1)continue;
          if(n.tagName&&n.tagName.toLowerCase()==="chat-widget")tagVoiceWidget(n);
          else scanWidgets(n);
        }
      }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
  // The loader may create a host before assigning its widgetId, so
  // rescan briefly until both widgets are tagged.
  var scans=0;
  var timer=setInterval(function(){
    scans++;
    scanWidgets(document);
    if(scans>120||(document.querySelector("chat-widget[data-voice-widget]")&&document.querySelector("chat-widget[data-chat-widget]")))clearInterval(timer);
  },500);
})();









































