import { createRouter,createWebHashHistory } from "vue-router";
import ant from '../views/ant.vue'



const routes = [
    {
      path:'/ant',
      name:ant,
      component:ant
    },
    
    {
      path:'/',
      redirect:'/ant'
    }
  ]

  const router = createRouter({
    history:createWebHashHistory(),
    routes
  })

  
  export default router
