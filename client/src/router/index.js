import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/login/Login')
const Register = () => import('@/views/register/Register')
const Boss = () => import('../views/home/Boss')
const Applicant = () => import('@/views/home/Applicant')
const ApplicantInfo = () => import('@/views/applicantInfo/ApplicantInfo')
const BossInfo = () => import('@/views/bossInfo/BossInfo')
const Chat = () => import('@/views/chat/Chat')
const NotFound = () => import('@/components/content/notFound/NotFound')
const Service = () => import('@/components/content/service/Service')
const Information = () => import('@/views/information/Information')
// 子路由
const BossIndex = () => import('@/views/index/BossIndex')
const ApplicantIndex = () => import('@/views/index/ApplicantIndex')
const BossMessage = () => import('@/views/message/BossMessage')
const ApplicantMessage = () => import('@/views/message/ApplicantMessage')
const ApplicantProfile = () => import('@/views/profile/ApplicantProfile')
const BossProfile = () => import('@/views/profile/BossProfile')
// 牛人相关路由
const Identity = () => import('@/views/identity/Identity')
const Release = () => import('@/views/release/Release')
const Management = () => import('@/views/management/Management')
// boss相关路由
const Purpose = () => import('@/views/purpose/Purpose')
const Resume = () => import('@/views/resume/Resume')
const Experience = () => import('@/views/experience/Experience')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/',
    components: {
      boss: Boss,
      applicant: Applicant
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        components: {
          applicantIndex: ApplicantIndex,
          bossIndex: BossIndex
        },
      },
      {
        path: 'message',
        name: 'Message',
        components: {
          applicantMessage: ApplicantMessage,
          bossMessage: BossMessage
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        components: {
          applicantProfile: ApplicantProfile,
          bossProfile: BossProfile
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/info',
    components: {
      applicantInfo: ApplicantInfo,
      bossInfo: BossInfo
    }
  },
  {
    path: '/purpose',
    name: 'Purpose',
    components:{
      bossPurpose: NotFound,
      applicantPurpose: Purpose
    }
  },
  {
    path: '/service',
    name: 'Service',
    components:{
      bossService: Service,
      applicantService: Service
    }
  },
  {
    path: '/experience',
    name: 'Experience',
    components: {
      bossExperience: NotFound,
      applicantExperience: Experience
    }
  },
  {
    path: '/information',
    name: 'Information',
    components: {
      bossInformation: Information,
      applicantInformation: Information
    }
  },
  {
    path: '/resume',
    name: 'Resume',
    components: {
      bossResume: NotFound,
      applicantResume: Resume
    }
  },
  {
    path: '/chat/:userid',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/identity',
    name: 'Identity',
    components: {
      bossIdentity: Identity,
      applicantIdentity: NotFound
    }
  },
  {
    path: '/release',
    name: 'Release',
    components: {
      bossRelease: Release,
      applicantRelease: NotFound
    }
  },
  {
    path: '/management',
    name: 'management',
    components: {
      bossManagement: Management,
      applicantManagement: NotFound
    }
  },
  //使用通配符进行配置404页面
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
