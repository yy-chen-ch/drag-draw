import { createRouter,createWebHashHistory } from "vue-router";
import ant from '../views/ant.vue'
import flow from '../views/flow.vue'


const routes = [
    {
      path:'/ant',
      name:ant,
      component:ant
    },
    {
      path:'/flow',
      component:flow
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
