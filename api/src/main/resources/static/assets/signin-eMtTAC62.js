import{j as e,I as s,B as n,c as t}from"./input-fYo5iGjU.js";function l(){const r=document.getElementById("_csrf");return e.jsx("div",{className:"absolute w-full h-full bg-background flex flex-col justify-center items-center",children:e.jsxs("form",{action:"/auth/signin",className:"flex items-center flex-col border border-border p-8 sm:p-16 rounded-lg w-full max-w-96",method:"post",children:[e.jsx("h1",{className:"text-2xl mb-8",children:"Sign In"}),e.jsxs("div",{className:"w-full mb-6",children:[e.jsx("label",{htmlFor:"username",children:"Username"}),e.jsx(s,{id:"username",name:"username",required:!0,type:"text"})]}),e.jsxs("div",{className:"w-full mb-8",children:[e.jsx("label",{htmlFor:"password",children:"Password"}),e.jsx(s,{id:"password",name:"password",required:!0,type:"password"})]}),e.jsx("input",{name:"_csrf",value:r.value,type:"hidden"}),e.jsx(n,{className:"w-full sm:w-auto",children:"Sign In"})]})})}const a=document.getElementById("root"),o=t(a);o.render(e.jsx(l,{}));